from bech32 import bech32_encode, convertbits


def hex_to_celestiavalcons(pub_key_hex: str | None) -> str | None:
    if not pub_key_hex:
        return None

    pub_key_bytes = bytes.fromhex(pub_key_hex.lower())
    if len(pub_key_bytes) != 20:
        return None

    converted_bits = convertbits(pub_key_bytes, 8, 5, True)
    if converted_bits is None:
        return None

    valcons_address = bech32_encode("celestiavalcons", converted_bits)
    return valcons_address
