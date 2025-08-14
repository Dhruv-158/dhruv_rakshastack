const { EntitySchema } = require('typeorm');

const PGListing = new EntitySchema({
    name: 'PGListing',
    tableName: 'pg_listings',
    columns: {
        id: {
            type: 'uuid',
            primary: true,
            generated: 'uuid',
        },
        owner_id: {
            type: 'uuid',
            nullable: false,
        },
        name: {
            type: 'varchar',
            length: 200,
            nullable: false,
        },
        location: {
            type: 'text',
            nullable: false,
        },
        address: {
            type: 'text',
            nullable: false,
        },
        city: {
            type: 'varchar',
            length: 100,
            nullable: false,
        },
        state: {
            type: 'varchar',
            length: 100,
            nullable: false,
        },
        pincode: {
            type: 'varchar',
            length: 10,
            nullable: false,
        },
        price: {
            type: 'decimal',
            precision: 10,
            scale: 2,
            nullable: false,
        },
        security_deposit: {
            type: 'decimal',
            precision: 10,
            scale: 2,
            nullable: true,
        },
        amenities: {
            type: 'text',
            array: true,
            nullable: true,
            default: () => "'{}'",
        },
        gender: {
            type: 'enum',
            enum: ['male', 'female', 'both'],
            nullable: false,
        },
        room_type: {
            type: 'enum',
            enum: ['single', 'double', 'triple', 'dormitory'],
            nullable: true,
        },
        available_rooms: {
            type: 'int',
            default: 0,
        },
        total_rooms: {
            type: 'int',
            default: 0,
        },
        images: {
            type: 'text',
            array: true,
            nullable: true,
            default: () => "'{}'",
        },
        description: {
            type: 'text',
            nullable: true,
        },
        rules: {
            type: 'text',
            array: true,
            nullable: true,
            default: () => "'{}'",
        },
        contact_phone: {
            type: 'varchar',
            length: 15,
            nullable: true,
        },
        contact_email: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        wifi: {
            type: 'boolean',
            default: false,
        },
        parking: {
            type: 'boolean',
            default: false,
        },
        laundry: {
            type: 'boolean',
            default: false,
        },
        food_included: {
            type: 'boolean',
            default: false,
        },
        ac: {
            type: 'boolean',
            default: false,
        },
        is_active: {
            type: 'boolean',
            default: true,
        },
        latitude: {
            type: 'decimal',
            precision: 10,
            scale: 8,
            nullable: true,
        },
        longitude: {
            type: 'decimal',
            precision: 11,
            scale: 8,
            nullable: true,
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
        owner: {
            target: 'Owner', // ✨ Back to 'Owner' (independent entity)
            type: 'many-to-one',
            joinColumn: { name: 'owner_id' },
            onDelete: 'CASCADE',
        },
    },
    indices: [
        {
            name: 'IDX_PG_CITY',
            columns: ['city'],
        },
        {
            name: 'IDX_PG_PRICE',
            columns: ['price'],
        },
        {
            name: 'IDX_PG_GENDER',
            columns: ['gender'],
        },
        {
            name: 'IDX_PG_LOCATION',
            columns: ['location'],
        },
        {
            name: 'IDX_PG_OWNER',
            columns: ['owner_id'],
        },
        {
            name: 'IDX_PG_ACTIVE',
            columns: ['is_active'],
        },
    ],
});

module.exports = PGListing;
