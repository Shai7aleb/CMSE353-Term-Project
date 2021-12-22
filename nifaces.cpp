#include <stdio.h>
#include <windows.h>
#include <iphlpapi.h>
#pragma comment(lib,"iphlpapi.lib")
#pragma comment(lib,"ws2_32.lib")

PMIB_IPADDRTABLE addrs;

extern "C" __declspec(dllexport) char* getaddresses(void) {
	ULONG size = 0;
	GetIpAddrTable(addrs,&size,FALSE); //calculate required size
	addrs = (PMIB_IPADDRTABLE)malloc(size);
	GetIpAddrTable(addrs, &size, FALSE);

	char* retlist = (char*)malloc(15ull * addrs->dwNumEntries);

	unsigned c = 0u;
	unsigned i;
	for (i = 0; i < (addrs->dwNumEntries) - 1; i++) {
		DWORD addr = addrs->table[i].dwAddr;
		DWORD mask = addrs->table[i].dwMask;
		DWORD broad = addr | (~mask);
		c += sprintf(retlist+c,"%d.%d.%d.%d ", broad & 0xffu, (broad >> 8) & 0xffu, (broad >> 16) & 0xffu, broad >> 24);
	}
	
	DWORD addr = addrs->table[i].dwAddr;
	DWORD mask = addrs->table[i].dwMask;
	DWORD broad = addr | (~mask);
	sprintf(retlist + c, "%d.%d.%d.%d", broad & 0xffu, (broad >> 8) & 0xffu, (broad >> 16) & 0xffu, broad >> 24);
	
	free(addrs);	
	return retlist;
}