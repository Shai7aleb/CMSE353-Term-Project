from socket import *
import secrets
import ctypes
import os
import time

'''
    This is the Network Module. As it is now, it is not very
    very reilable but atleast implements the basic interface to be 
    used by the other modules.
    
    Brief documentation:
    network()
        create a network object
    
    network.send(data,target_address) 
        send data(in bytes).
        target_address is optional and only specified if you want to send
        data to a particular device. To broadcast, omit this parameter.
    
    network.recv() 
        recieve data. It returns (message,source_address)
        if a message was recieved. Otherwise, it will return None.
        Note, this function is garanteed to return no more than 1 message.
        
    network.close()
        call this function when you are done using this object
'''

class Message:
    def __init__(self,header,data):
        self.header = header
        self.data = data
    def __bytes__(self):
        return header.to_bytes(4,'big') + data

class network:
    __PORT_NUM = 8333
    def __init__(self):
        #get local ip addresses
        ga = None
        try: #try loading the 64 bit dll, if that doesnt work, load the 32 bit one
            ga = ctypes.CDLL(os.path.dirname(__file__) + '\\nifaces64.dll').getaddresses 
        except OSError:
            ga = ctypes.CDLL(os.path.dirname(__file__) + '\\nifaces32.dll').getaddresses
            
        #for some reason CDLL doesnt like relative file paths
        #getaddresses is a function imported from the dll that returns a list of local ip addresses as space seperated values
        ga.restype = ctypes.c_char_p
        ipaddress = [i for i in ga().decode().split(' ') ] #list of local ip addresses
        
        #initialize sockets
        self.__sudp = []
        for addr in ipaddress:
            s = socket(AF_INET,SOCK_DGRAM)
            s.bind((addr,self.__PORT_NUM))
            s.setblocking(False)
            s.setsockopt(SOL_SOCKET,SO_BROADCAST,True)
            self.__sudp.append(s)
        
        self.__uniquetoken = secrets.token_bytes(8) #this is done to prevent a device recieving message from itself
        
    def close(self):
        for s in self.__sudp:
            s.shutdown()
            s.close()
        
    def send(self,data,taddress = None):
        ut = self.__uniquetoken
        while True:
         try:
            if taddress == None:
                for s in self.__sudp:
                    s.sendto(ut + data,('255.255.255.255',self.__PORT_NUM))
                    time.sleep(1/20) #delay to prevent packet loss
            else:
                for s in self.__sudp:
                    s.sendto(ut + data,(taddress,self.__PORT_NUM))
                    time.sleep(1/20) #delay to prevent packet loss
            break;
         except Exception:
            continue
            
    def recv(self):
        for s in self.__sudp:
            try:
                data,ipandport =  s.recvfrom(4096)
                if(data[0:8] != s.__uniquetoken):
                    return (data[8:],ipandport[0]) #remove first 8 bytes
            except Exception:
                pass

        return None
        
        