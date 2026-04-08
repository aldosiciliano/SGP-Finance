"""Create inversiones table

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-04-08 00:00:01.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = 'b2c3d4e5f6a7'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if inspector.has_table('inversiones'):
        return

    op.create_table(
        'inversiones',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nombre', sa.String(), nullable=False),
        sa.Column('tipo', sa.String(), nullable=False),
        sa.Column('monto_ars', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('fecha_entrada', sa.DateTime(timezone=True), nullable=True),
        sa.Column('notas', sa.String(), nullable=True),
        sa.Column('usuario_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_inversiones_id'), 'inversiones', ['id'], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if not inspector.has_table('inversiones'):
        return

    op.drop_index(op.f('ix_inversiones_id'), table_name='inversiones')
    op.drop_table('inversiones')
