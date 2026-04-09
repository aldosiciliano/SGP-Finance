"""Remove unused currency fields

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-04-08 00:00:03.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = 'd4e5f6a7b8c9'
down_revision = 'c3d4e5f6a7b8'
branch_labels = None
depends_on = None


def _has_column(inspector, table_name: str, column_name: str) -> bool:
    return any(column['name'] == column_name for column in inspector.get_columns(table_name))


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if inspector.has_table('gastos') and _has_column(inspector, 'gastos', 'monto_usd'):
        op.drop_column('gastos', 'monto_usd')

    if inspector.has_table('inversiones') and _has_column(inspector, 'inversiones', 'monto_usd'):
        op.drop_column('inversiones', 'monto_usd')

    if inspector.has_table('tipos_cambio'):
        indexes = {index['name'] for index in inspector.get_indexes('tipos_cambio')}
        if 'ix_tipos_cambio_id' in indexes:
            op.drop_index('ix_tipos_cambio_id', table_name='tipos_cambio')
        op.drop_table('tipos_cambio')


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if not inspector.has_table('tipos_cambio'):
        op.create_table(
            'tipos_cambio',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('fecha', sa.Date(), nullable=False),
            sa.Column('usd_ars', sa.Numeric(precision=10, scale=4), nullable=False),
            sa.Column('fuente', sa.String(), nullable=False),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('fecha')
        )
        op.create_index(op.f('ix_tipos_cambio_id'), 'tipos_cambio', ['id'], unique=False)

    inspector = inspect(bind)

    if inspector.has_table('gastos') and not _has_column(inspector, 'gastos', 'monto_usd'):
        op.add_column('gastos', sa.Column('monto_usd', sa.Numeric(precision=12, scale=2), nullable=True))

    if inspector.has_table('inversiones') and not _has_column(inspector, 'inversiones', 'monto_usd'):
        op.add_column('inversiones', sa.Column('monto_usd', sa.Numeric(precision=12, scale=2), nullable=True))
