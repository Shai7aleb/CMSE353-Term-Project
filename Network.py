from socket import *
import secrets

'''
    This is the Network Module. As it is now, it is not very
    very reilable but atleas implements the basic interface to be 
    used by the other modules.
    
    Brief documentation:
    broadcaster()
        create a network object
    
    broadcaster.send(data,target_address) 
        send data(in bytes).
        target_address is optional and only specified if you want to send
        data to a particular device. To broadcast, omit this parameter.
    
    broadcaster.recv() 
        recieve data. It returns (message,source_address)
        if a message was recieved. Otherwise, it will return None.
        Note, this function is garanteed to return no more than 1 message.
        
    broadcaster.close()
        call this function when you are done using this object
'''

class Message:
    def __init__(self,header,data):
        self.header = header
        self.data = data
    def __bytes__(self):
        return header.to_bytes(4,'big') + data

class broadcaster:
    __PORT_NUM = 8333
    def __init__(self):
        self.__sudp = socket(AF_INET,SOCK_DGRAM)
        self.__sudp.bind(('',self.__PORT_NUM))
        self.__sudp.setblocking(False)
        self.__sudp.setsockopt(SOL_SOCKET,SO_BROADCAST,True)
        self.__uniquetoken = secrets.token_bytes(8) #this is done to prevent a device recieving message from itself
        
    def close(self):
        self.__sudp.shutdown()
        self.__sudp.close()
        
    def send(self,data,taddress = None):
        ut = self.__uniquetoken
        while True:
         try:
            if taddress == None:
                self.__sudp.sendto(ut + data,('255.255.255.255',self.__PORT_NUM))
            else:
                self.__sudp.sendto(ut + data,(taddress,self.__PORT_NUM))
            break;
         except:
            continue
            
    def recv(self):
        try:
            data,ipandport =  self.__sudp.recvfrom(4096)
            if(data[0:8] != self.__uniquetoken):
                return (data[8:],ipandport[0]) #remove first 8 bytes
            else:
                return None
        except:
            return None
        
        