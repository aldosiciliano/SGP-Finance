"""Create usuarios table

Revision ID: 9133fcfcd97c
Revises: 
Create Date: 2026-04-03 23:24:09.462960

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9133fcfcd97c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Base revision: solo usuarios.
    op.create_table('usuarios',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('nombre', sa.String(), nullable=True),
    sa.Column('creado_en', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_usuarios_email'), 'usuarios', ['email'], unique=True)
    op.create_index(op.f('ix_usuarios_id'), 'usuarios', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_usuarios_id'), table_name='usuarios')
    op.drop_index(op.f('ix_usuarios_email'), table_name='usuarios')
    op.drop_table('usuarios')
