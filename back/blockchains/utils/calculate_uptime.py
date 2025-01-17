from decimal import Decimal

from blockchains.models import BlockchainValidator


def calculate_uptime(
    missed_blocks_counter: int, validator_status: BlockchainValidator.Status
) -> Decimal:
    total_blocks = 10000
    if (
        validator_status != BlockchainValidator.Status.BOND_STATUS_BONDED
        or missed_blocks_counter >= total_blocks
    ):
        return Decimal("0.00")
    uptime_percentage = Decimal(
        (total_blocks - missed_blocks_counter) / total_blocks * 100
    )
    return uptime_percentage.quantize(Decimal("0.01"))
