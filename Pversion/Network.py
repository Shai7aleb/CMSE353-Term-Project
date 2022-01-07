from socket import *
import secrets
import ctypes
import os
import time
from threading import Thread,Lock

def _addrstobytes(addrs): #convert list of ip addresses to bytes with space seperated values
    return ' '.join(addrs).encode()
    
def _bytestoaddrs(byts): #convert list of ip addresses to bytes with space seperated values
    if len(byts) > 0:
        return set(byts.decode().split(' '))
    else:
        return set()

def _recvmsg(sock):
    sock.setblocking(False)
    buffer = None
    try:
        buffer = sock.recv(4)
    except Exception:
        return None
    
    sock.setblocking(True)
    while(len(buffer) < 4):
        addbuff = sock.recv(4 - len(buffer))
        buffer += addbuff
        
    msglen = int.from_bytes(buffer,'big')
    buffer = b''
    
    while(len(buffer) < msglen):
        addbuff = sock.recv(msglen - len(buffer))
        buffer += addbuff
        
    return buffer

def _sendmsg(sock,data):
    length = len(data).to_bytes(4,'big')
    sock.sendall(length + data)

class network:
    def __Thread2(self): #this thread running in the background    
        tcplistener = socket(AF_INET,SOCK_STREAM)
        tcplistener.bind(('',self.__PORT_NUM))
        tcplistener.listen()
        
        while True:
            srecv = self.__udprecv()
            if (srecv is not None):
                if(srecv[0][8:9] == self.__CONNREQST):
                    csock,_ = tcplistener.accept()
                    self.__stcplock.acquire()
                    
                    self.__stcp.add(csock)
                    self.__taddrs.add(srecv[1])
                    
                    self.__stcplock.release()
                elif(srecv[0][8:9] == self.__INITQUERY):
                    self.__udpsend(self.__QRESPONSE + _addrstobytes(self.__taddrs),srecv[1])
        
    def __init__(self):
        #------------------------defining class members------------------------
        self.__stcp = set() #set of tcp sockets with peers
        self.__stcplock = Lock() #a mutex used when accessing __stcp
        self.__sudp = [] #set of local udp sockets
        self.__uniquetoken = secrets.token_bytes(8) #this is done to prevent a device recieving message from itself
        self.__PORT_NUM = 8333
        self.__taddrs = set() #a set of ip addresses of peers
        #message ENUMS
        self.__INITQUERY = (0).to_bytes(1,'big') #initial query
        self.__QRESPONSE = (1).to_bytes(1,'big') #query response
        self.__QRESPONSEN = (2).to_bytes(1,'big') #query response from non connected device
        self.__CONNREQST = (3).to_bytes(1,'big') #send connection request
        self.__thread2 = None
        
        #------------------------get local ip addresses----------------------------
        ga = None
        try: #try loading the 64 bit dll, if that doesnt work, load the 32 bit one
            ga = ctypes.CDLL(os.path.dirname(__file__) + '\\nifaces64.dll').getaddresses #for some reason CDLL doesnt like relative file paths
        except OSError:
            ga = ctypes.CDLL(os.path.dirname(__file__) + '\\nifaces32.dll').getaddresses #for some reason CDLL doesnt like relative file paths
            
        #getaddresses is a function imported from the dll that returns a list of local ip addresses as space seperated values
        ga.restype = ctypes.c_char_p
        ipaddress = ga().decode().split(' ') #list of local ip addresses
        
        #------------------------initialize UDP sockets-------------------------------
        for addr in ipaddress:
            try:
                s = socket(AF_INET,SOCK_DGRAM)
                s.bind((addr,self.__PORT_NUM))
                s.setblocking(False)
                s.setsockopt(SOL_SOCKET,SO_BROADCAST,True)
                self.__sudp.append(s)
            except Exception:
                pass
        
        #-------------------------Detect other devices on the network------------------------------
        for i in range(15): #try 15 times to counter risk of packet loss
            self.__udpsend(self.__INITQUERY + _addrstobytes(self.__taddrs)) #broadcast an initial query
            time.sleep(1/10) #wait for responses
            
            while True: #note the format of the packets is as follows: unique_tag(8 bytes) + messagetype(1 byte) + additional info(rest of the messaage)
                r = self.__udprecv()
                if r is not None:
                    if(r[0][8:9] == self.__QRESPONSE):
                        self.__taddrs.add(r[1])
                        self.__taddrs.update(_bytestoaddrs(r[0][9:]))
                    elif(r[0][8:9] == self.__QRESPONSEN and r[0][0:8] > self.__uniquetoken): #the second check is to avoid the situation where 2 devices try to connect to each other
                        self.__taddrs.add(r[1]) #done to avoid deadloack
                        self.__taddrs.update(_bytestoaddrs(r[0][9:]))
                    elif(r[0][8:9] == self.__INITQUERY):
                        self.__udpsend(self.__QRESPONSEN + _addrstobytes(self.__taddrs),r[1])
                else:
                    break
        #------------------------establish connection to the detected devices---------------------------
        for i in self.__taddrs:
            s = socket(AF_INET , SOCK_STREAM)
            for j in range(15): #try 15 times before terminating
                self.__udpsend(self.__CONNREQST,i)
                time.sleep(1/20)
                try:
                    s.connect((i,self.__PORT_NUM))
                    self.__stcp.add(s)
                    break
                except Exception:
                    pass
            
        #-----------------------start the other thread-------------------------------------------
        self.__thread2 = Thread(target = self.__Thread2)
        self.__thread2.daemon = True #makes to so that this thread kills itself when the main thread is closed
        self.__thread2.start()
        return
        
                
    def close(self):
        for s in self.__stcp:
            s.shutdown(SHUT_RDWR)
            s.close()
            
        for s in self.__sudp:
            s.shutdown(SHUT_RDWR)
            s.close()
        
    def __udpsend(self,data,taddress = None):
       ut = self.__uniquetoken
       if taddress == None:
           for s in self.__sudp:
                try:
                    s.sendto(ut + data,('255.255.255.255',self.__PORT_NUM))
                except OSError:
                    pass
       else:
           for s in self.__sudp:
                try:
                    s.sendto(ut + data,(taddress,self.__PORT_NUM))
                    time.sleep(1/20) #delay to prevent packet loss
                except OSError:
                    pass
            
    def __udprecv(self):
        for s in self.__sudp:
            try:
                data,ipandport =  s.recvfrom(4096)
                if(data[0:8] != self.__uniquetoken):
                    return (data,ipandport[0])
            except BlockingIOError:
                pass

        return None
            
    def recv(self):
        self.__stcplock.acquire() #acquire mutex
        buffer = None
        src = None
        
        for i in self.__stcp:
            buffer = _recvmsg(i)
            if buffer is not None:
                src = i.getpeername()[0]
                break
        
        self.__stcplock.release() #release mutex
        
        if src is not None:
            return (buffer , src)
        else:
            return None
    
    def send(self,data,target = None):
        self.__stcplock.acquire() #acquire mutex
        length = len(data).to_bytes(4,'big')
        if target == None:
            for i in self.__stcp: #send message to all peers
                _sendmsg(i,data)
        else:
            for i in self.__stcp:
                if(i.getpeername()[0] == target): #only send message to specified peer
                    _sendmsg(i,data)
                    break
        self.__stcplock.release() #release mutex