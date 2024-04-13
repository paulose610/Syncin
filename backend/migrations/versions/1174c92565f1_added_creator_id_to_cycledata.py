"""added creator_id to cycledata

Revision ID: 1174c92565f1
Revises: 82f00d62270d
Create Date: 2024-03-29 15:55:14.176025

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1174c92565f1'
down_revision = '82f00d62270d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cycledata', schema=None) as batch_op:
        batch_op.add_column(sa.Column('creator_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key('usid', 'user', ['creator_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cycledata', schema=None) as batch_op:
        batch_op.drop_constraint('usid', type_='foreignkey')
        batch_op.drop_column('creator_id')

    # ### end Alembic commands ###
