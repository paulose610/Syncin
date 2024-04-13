"""added flagsto albums

Revision ID: 014f07404d63
Revises: 
Create Date: 2024-03-26 22:33:08.137368

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '014f07404d63'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('role',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=True),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('creator_name', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('password', sa.String(length=255), nullable=True),
    sa.Column('fs_uniquifier', sa.String(length=255), nullable=False),
    sa.Column('active', sa.Boolean(), nullable=True),
    sa.Column('clikes', sa.Integer(), nullable=True),
    sa.Column('cflags', sa.Integer(), nullable=True),
    sa.Column('sub', sa.Boolean(), nullable=True),
    sa.Column('subdate', sa.DateTime(), nullable=True),
    sa.Column('last_played', sa.String(length=40), nullable=True),
    sa.Column('visited', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('creator_name'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('fs_uniquifier')
    )
    op.create_table('album',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('creator_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('cover', sa.String(length=255), nullable=True),
    sa.Column('likes', sa.Integer(), nullable=False),
    sa.Column('flags', sa.Integer(), nullable=True),
    sa.Column('time_played', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['creator_id'], ['user.id'], name='usid'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('roles_users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('song',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('lyrics', sa.String(length=20), nullable=True),
    sa.Column('cover', sa.String(length=255), nullable=True),
    sa.Column('audio', sa.String(length=255), nullable=False),
    sa.Column('likes', sa.Integer(), nullable=False),
    sa.Column('flags', sa.Integer(), nullable=True),
    sa.Column('time_played', sa.Integer(), nullable=False),
    sa.Column('creator_id', sa.Integer(), nullable=False),
    sa.Column('album_id', sa.Integer(), nullable=True),
    sa.Column('genre', sa.String(), nullable=False),
    sa.Column('play', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['album_id'], ['album.id'], name='alid'),
    sa.ForeignKeyConstraint(['creator_id'], ['user.id'], name='usid'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('cycledata',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('song_id', sa.Integer(), nullable=True),
    sa.Column('likes', sa.Integer(), nullable=False),
    sa.Column('time_played', sa.Integer(), nullable=False),
    sa.Column('flags', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['song_id'], ['song.id'], name='sid'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('flaggedsongs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('song_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['song_id'], ['song.id'], name='soid'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='usid'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('likedsongs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('song_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['song_id'], ['song.id'], name='soid'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='usid'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('playlist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('song_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['song_id'], ['song.id'], name='sid'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='usid'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('playlist')
    op.drop_table('likedsongs')
    op.drop_table('flaggedsongs')
    op.drop_table('cycledata')
    op.drop_table('song')
    op.drop_table('roles_users')
    op.drop_table('album')
    op.drop_table('user')
    op.drop_table('role')
    # ### end Alembic commands ###
