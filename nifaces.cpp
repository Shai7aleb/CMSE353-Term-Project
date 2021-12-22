#include <stdio.h>
#include <windows.h>
#include <iphlpapi.h>
#pragma comment(lib,"iphlpapi.lib")
#pragma comment(lib,"ws2_32.lib")


extern "C" __declspec(dllexport) char* getaddresses(void) {
	ULONG size = sizeof(MIB_IPADDRTABLE);
	PMIB_IPADDRTABLE addrs = (PMIB_IPADDRTABLE)malloc(size);

	if (GetIpAddrTable(addrs, &size, FALSE) == ERROR_INSUFFICIENT_BUFFER) {//this function sets the size if it wasnt enough
		free(addrs);
		addrs = (PMIB_IPADDRTABLE)malloc(size);
		GetIpAddrTable(addrs, &size, FALSE);
	}

	char* retlist = (char*)malloc(15ull * addrs->dwNumEntries); //an ip address is 15 chars maximum

	unsigned c = 0u;
	unsigned i;
	for (i = 0; i < (addrs->dwNumEntries) - 1; i++) {
		DWORD addr = addrs->table[i].dwAddr;
		c += sprintf(retlist+c,"%d.%d.%d.%d ", addr & 0xffu, (addr >> 8) & 0xffu, (addr >> 16) & 0xffu, addr >> 24);
	}
	
	DWORD addr = addrs->table[i].dwAddr;
	sprintf(retlist + c, "%d.%d.%d.%d", addr & 0xffu, (addr >> 8) & 0xffu, (addr >> 16) & 0xffu, addr >> 24);
	
	free(addrs);	
	return retlist;
}