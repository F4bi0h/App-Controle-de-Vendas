import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('vendas2.db');

export const createTables = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                descricao TEXT,
                valor REAL,
                quantidade INTEGER
            );`
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente TEXT,
                telefone TEXT,
                endereco TEXT,
                produto TEXT,
                quantidade INTEGER,
                status TEXT
            );`
        );
    });
};

export const getDb = () => db;
