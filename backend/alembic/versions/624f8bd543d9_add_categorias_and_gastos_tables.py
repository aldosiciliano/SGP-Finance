"""Add categorias and gastos tables

Revision ID: 624f8bd543d9
Revises: 9133fcfcd97c
Create Date: 2026-04-04 13:49:56.003631

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = '624f8bd543d9'
down_revision = '9133fcfcd97c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if inspector.has_table('categorias'):
        return

    op.create_table(
        'categorias',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nombre', sa.String(), nullable=False),
        sa.Column('icono', sa.String(), nullable=True),
        sa.Column('color', sa.String(), nullable=True),
        sa.Column('usuario_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categorias_id'), 'categorias', ['id'], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if not inspector.has_table('categorias'):
        return

    op.drop_index(op.f('ix_categorias_id'), table_name='categorias')
    op.drop_table('categorias')
