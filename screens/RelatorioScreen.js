import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RelatorioScreen() {
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const dadosProdutos = await AsyncStorage.getItem('@produtos');
    const dadosPedidos = await AsyncStorage.getItem('@pedidos');

    setProdutos(JSON.parse(dadosProdutos) || []);
    setPedidos(JSON.parse(dadosPedidos) || []);
  };

  const totalProdutos = produtos.length;
  const estoqueTotal = produtos.reduce((soma, p) => soma + p.quantidade, 0);

  const totalPedidos = pedidos.length;
  const pendentes = pedidos.filter(p => p.status === 'pendente').length;
  const aCaminho = pedidos.filter(p => p.status === 'a_caminho').length;
  const entregues = pedidos.filter(p => p.status === 'entregue').length;

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        Relatório Geral
      </Text>

      <Card style={{ marginBottom: 12 }}>
        <Card.Title title="Produtos" />
        <Card.Content>
          <Text>Total de Produtos Cadastrados: {totalProdutos}</Text>
          <Text>Quantidade Total em Estoque: {estoqueTotal}</Text>
        </Card.Content>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <Card.Title title="Pedidos" />
        <Card.Content>
          <Text>Total de Pedidos: {totalPedidos}</Text>
          <Text>Pedidos Pendentes: {pendentes}</Text>
          <Text>Pedidos a Caminho: {aCaminho}</Text>
          <Text>Pedidos Entregues: {entregues}</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
