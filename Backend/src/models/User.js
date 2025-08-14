const { EntitySchema } = require('typeorm');

const User = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        name: {
            type: 'varchar',
            length: 100,
            nullable: false,
        },
        email: {
            type: 'varchar',
            length: 255,
            unique: true,
            nullable: false,
        },
        password: {
            type: 'varchar',
            length: 255,
            nullable: false,
        },
        phone: {
            type: 'varchar',
            length: 15,
            nullable: true,
        },
        gender: {
            type: 'enum',
            enum: ['male', 'female', 'other'],
            nullable: true,
        },
        occupation: {
            type: 'varchar',
            length: 100,
            nullable: true,
        },
        profile_image: {
            type: 'text',
            nullable: true,
        },
        is_active: {
            type: 'boolean',
            default: true,
        },
        created_at: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        updated_at: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
        },
    },
    indices: [
        {
            name: 'IDX_USER_EMAIL',
            columns: ['email'],
        },
    ],
});

module.exports = User;
