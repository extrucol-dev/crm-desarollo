import sys
path = r'C:\Users\PRACT.SISTEMAS\Desktop\crm-desarollo\sql\01_usuarios\01_crm_usuarios_api_body.sql'
with open(path, 'rb') as f:
    data = f.read()
print('Length:', len(data))
bad = [(i, b) for i, b in enumerate(data) if b > 127]
print('Non-ASCII bytes:', len(bad))
for pos, b in bad:
    print(f'  pos {pos}: 0x{b:02X} ({chr(b) if b < 256 else "?"})')
# Show last 40 bytes
print('Last 40 bytes hex:', data[-40:].hex())
print('Last 40 bytes dec:', list(data[-40:]))