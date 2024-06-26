"""removed fk from ls anf fs

Revision ID: 4337d90cb0e5
Revises: 5187ebd49962
Create Date: 2024-03-31 16:18:11.725472

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4337d90cb0e5'
down_revision = '5187ebd49962'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('likedsongs', schema=None) as batch_op:
        batch_op.alter_column('song_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.drop_constraint('soid', type_='foreignkey')

    with op.batch_alter_table('playlist', schema=None) as batch_op:
        batch_op.alter_column('song_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.drop_constraint('sid', type_='foreignkey')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('playlist', schema=None) as batch_op:
        batch_op.create_foreign_key('sid', 'song', ['song_id'], ['id'])
        batch_op.alter_column('song_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('likedsongs', schema=None) as batch_op:
        batch_op.create_foreign_key('soid', 'song', ['song_id'], ['id'])
        batch_op.alter_column('song_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###
