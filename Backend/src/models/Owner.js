const { EntitySchema } = require('typeorm');

const Owner = new EntitySchema({
    name: 'Owner',
    tableName: 'owners',
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
        business_name: {
            type: 'varchar',
            length: 150,
            nullable: true,
        },
        business_address: {
            type: 'text',
            nullable: true,
        },
        verification_status: {
            type: 'enum',
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
        documents: {
            type: 'text',
            array: true,
            nullable: true,
            default: () => "'{}'",
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
    relations: {
        pgListings: {
            target: 'PGListing',
            type: 'one-to-many',
            inverseSide: 'owner',
        },
    },
    indices: [
        {
            name: 'IDX_OWNER_EMAIL',
            columns: ['email'],
        },
        {
            name: 'IDX_OWNER_VERIFICATION',
            columns: ['verification_status'],
        },
        {
            name: 'IDX_OWNER_BUSINESS',
            columns: ['business_name'],
        },
    ],
});

module.exports = Owner;
