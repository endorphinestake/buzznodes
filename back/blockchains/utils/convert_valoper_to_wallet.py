from bech32 import bech32_decode, bech32_encode


def convert_valoper_to_wallet(valoper_address: str | None) -> str | None:
    if not valoper_address:
        return None

    hrp, data = bech32_decode(valoper_address)
    if hrp.endswith("valoper"):
        wallet_hrp = hrp.replace("valoper", "")
        wallet_address = bech32_encode(wallet_hrp, data)
        return wallet_address
    return None
