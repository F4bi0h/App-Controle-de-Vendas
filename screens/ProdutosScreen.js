import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Alert
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProdutosScreen() {
  const [produtos, setProdutos] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const salvarProdutos = async (dados) => {
    try {
      await AsyncStorage.setItem('@produtos', JSON.stringify(dados));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os produtos');
    }
  };

  const carregarProdutos = async () => {
    try {
      const dados = await AsyncStorage.getItem('@produtos');
      if (dados) setProdutos(JSON.parse(dados));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    }
  };

  const limparCampos = () => {
    setDescricao('');
    setValor('');
    setQuantidade('');
    setEditandoId(null);
  };

  const adicionarOuEditarProduto = () => {
    if (!descricao.trim() || !valor.trim() || !quantidade.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const novoProduto = {
      id: editandoId || Date.now().toString(),
      descricao: descricao.trim(),
      valor: parseFloat(valor),
      quantidade: parseInt(quantidade),
    };

    let atualizados;
    if (editandoId) {
      atualizados = produtos.map(p => (p.id === editandoId ? novoProduto : p));
    } else {
      atualizados = [...produtos, novoProduto];
    }

    setProdutos(atualizados);
    salvarProdutos(atualizados);
    limparCampos();
  };

  const editarProduto = (produto) => {
    setDescricao(produto.descricao);
    setValor(String(produto.valor));
    setQuantidade(String(produto.quantidade));
    setEditandoId(produto.id);
  };

  const excluirProduto = (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: () => {
            const filtrados = produtos.filter(p => p.id !== id);
            setProdutos(filtrados);
            salvarProdutos(filtrados);
            if (editandoId === id) limparCampos();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        {editandoId ? 'Editar Produto' : 'Novo Produto'}
      </Text>

      <TextInput
        label="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        style={{ marginBottom: 8 }}
      />
      <TextInput
        label="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        style={{ marginBottom: 8 }}
      />
      <Button mode="contained" onPress={adicionarOuEditarProduto}>
        {editandoId ? 'Salvar Edição' : 'Adicionar Produto'}
      </Button>

      <Text variant="titleMedium" style={{ marginTop: 24 }}>
        Produtos Cadastrados
      </Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginTop: 12 }}>
            <Card.Title title={item.descricao} />
            <Card.Content>
              <Text>Valor: R$ {item.valor.toFixed(2)}</Text>
              <Text>Quantidade: {item.quantidade}</Text>
            </Card.Content>
            <Card.Actions>
              <IconButton icon="pencil" onPress={() => editarProduto(item)} />
              <IconButton icon="delete" onPress={() => excluirProduto(item.id)} />
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}
