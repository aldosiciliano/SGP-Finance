"""Create gastos table

Revision ID: a1b2c3d4e5f6
Revises: 624f8bd543d9
Create Date: 2026-04-08 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '624f8bd543d9'
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if inspector.has_table('gastos'):
        return

    op.create_table(
        'gastos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('monto_ars', sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column('descripcion', sa.String(), nullable=True),
        sa.Column('fecha', sa.DateTime(timezone=True), nullable=False),
        sa.Column('categoria_id', sa.Integer(), nullable=False),
        sa.Column('usuario_id', sa.Integer(), nullable=False),
        sa.Column('etiquetas', sa.ARRAY(sa.String()), nullable=True),
        sa.ForeignKeyConstraint(['categoria_id'], ['categorias.id']),
        sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_gastos_id'), 'gastos', ['id'], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)

    if not inspector.has_table('gastos'):
        return

    op.drop_index(op.f('ix_gastos_id'), table_name='gastos')
    op.drop_table('gastos')
