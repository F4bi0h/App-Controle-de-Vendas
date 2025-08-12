import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  RadioButton,
  Dialog,
  Portal,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function PedidosScreen() {
  const [pedido, setPedido] = useState({
    id: null,
    cliente: '',
    telefone: '',
    endereco: '',
    produto: '',
    quantidade: '',
    status: 'pendente',
    valorProduto: 0,
    justificativaEdicao: '',
  });

  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(false);

  const [dialogJustificativaVisible, setDialogJustificativaVisible] = useState(false);
  const [justificativaTemp, setJustificativaTemp] = useState('');
  const [acaoAtual, setAcaoAtual] = useState(null);

  // Ref do ScrollView para controlar scroll
  const scrollViewRef = useRef();

  useEffect(() => {
    carregarPedidos();
    carregarProdutos();
  }, []);

  const carregarPedidos = async () => {
    const data = await AsyncStorage.getItem('@pedidos');
    if (data) setPedidos(JSON.parse(data));
  };

  const carregarProdutos = async () => {
    const data = await AsyncStorage.getItem('@produtos');
    if (data) setProdutos(JSON.parse(data));
  };

  const salvarPedidosStorage = async (novosPedidos) => {
    setPedidos(novosPedidos);
    await AsyncStorage.setItem('@pedidos', JSON.stringify(novosPedidos));
  };

  const abrirDialogJustificativa = (acao) => {
    setAcaoAtual(acao);
    setJustificativaTemp('');
    setDialogJustificativaVisible(true);
  };

  const fecharDialogJustificativa = () => {
    setDialogJustificativaVisible(false);
  };

  const confirmarJustificativa = () => {
    if (!justificativaTemp.trim()) {
      Alert.alert('Justificativa é obrigatória!');
      return;
    }

    if (acaoAtual === 'editar') {
      salvarEdicao(justificativaTemp);
    } else if (acaoAtual === 'excluir') {
      confirmarExclusao(justificativaTemp);
    }

    fecharDialogJustificativa();
  };

  const salvarEdicao = (justificativa) => {
    const produtoSelecionado = produtos.find((p) => p.descricao === pedido.produto);
    if (!produtoSelecionado) {
      Alert.alert('Erro', 'Produto selecionado inválido.');
      return;
    }

    const novosPedidos = pedidos.map((p) =>
      p.id === pedido.id
        ? {
            ...pedido,
            valorProduto: produtoSelecionado.valor,
            justificativaEdicao: justificativa,
          }
        : p
    );

    salvarPedidosStorage(novosPedidos);
    limparFormulario();
  };

  const confirmarExclusao = (justificativa) => {
    const novosPedidos = pedidos.map((p) =>
      p.id === pedido.id
        ? { ...p, excluido: true, justificativaExclusao: justificativa }
        : p
    );
    salvarPedidosStorage(novosPedidos);
    limparFormulario();
  };

  const limparFormulario = () => {
    setPedido({
      id: null,
      cliente: '',
      telefone: '',
      endereco: '',
      produto: '',
      quantidade: '',
      status: 'pendente',
      valorProduto: 0,
      justificativaEdicao: '',
    });
    setEditando(false);
  };

  const iniciarEdicao = (p) => {
    setPedido({ ...p });
    setEditando(true);

    // Scroll para o topo para mostrar inputs
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, 100); // pequeno delay para garantir renderização
  };

  const salvarPedido = () => {
    if (!pedido.cliente || !pedido.produto || !pedido.quantidade) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios!');
      return;
    }
    if (editando) {
      abrirDialogJustificativa('editar');
    } else {
      const produtoSelecionado = produtos.find(
        (p) => p.descricao === pedido.produto
      );
      if (!produtoSelecionado) {
        Alert.alert('Erro', 'Produto selecionado inválido.');
        return;
      }
      const novoPedido = {
        ...pedido,
        id: Date.now().toString(),
        criado_em: new Date().toISOString(),
        excluido: false,
        valorProduto: produtoSelecionado.valor,
        justificativaEdicao: '',
        justificativaExclusao: '',
      };
      const novosPedidos = [...pedidos, novoPedido];
      salvarPedidosStorage(novosPedidos);
      limparFormulario();
    }
  };

  const solicitarExclusao = (p) => {
    setPedido(p);
    abrirDialogJustificativa('excluir');
  };

  const calcularTotalEntregues = () => {
    const pedidosConcluidos = pedidos.filter((p) => p.status === 'concluído' && !p.excluido);
    const total = pedidosConcluidos.reduce((acc, p) => {
      const quantidade = parseInt(p.quantidade) || 0;
      const valor = parseFloat(p.valorProduto) || 0;
      return acc + quantidade * valor;
    }, 0);
    return total.toFixed(2);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView style={{ padding: 16 }} ref={scrollViewRef}>
        <Text variant="titleMedium" style={{ marginBottom: 16 }}>
          {editando ? 'Editar Pedido' : 'Novo Pedido'}
        </Text>

        <TextInput
          label="Cliente"
          value={pedido.cliente}
          onChangeText={(text) => setPedido({ ...pedido, cliente: text })}
          style={{ marginBottom: 8 }}
        />
        <TextInput
          label="Telefone"
          value={pedido.telefone}
          onChangeText={(text) => setPedido({ ...pedido, telefone: text })}
          style={{ marginBottom: 8 }}
          keyboardType="phone-pad"
        />
        <TextInput
          label="Endereço"
          value={pedido.endereco}
          onChangeText={(text) => setPedido({ ...pedido, endereco: text })}
          style={{ marginBottom: 8 }}
        />

        <View
          style={{
            borderWidth: 1,
            borderColor: '#999',
            borderRadius: 4,
            marginBottom: 16,
            backgroundColor: '#1e1e1e',
          }}
        >
          <Picker
            selectedValue={pedido.produto}
            onValueChange={(itemValue) => setPedido({ ...pedido, produto: itemValue })}
            style={{ color: 'white' }}
            dropdownIconColor="white"
          >
            <Picker.Item label="Selecione um produto" value="" />
            {produtos.map((produto) => (
              <Picker.Item key={produto.id} label={produto.descricao} value={produto.descricao} />
            ))}
          </Picker>
        </View>

        <TextInput
          label="Quantidade"
          value={pedido.quantidade}
          onChangeText={(text) => setPedido({ ...pedido, quantidade: text })}
          style={{ marginBottom: 8 }}
          keyboardType="numeric"
        />

        <Text variant="labelLarge" style={{ marginBottom: 8 }}>
          Status
        </Text>
        <RadioButton.Group
          onValueChange={(newStatus) => setPedido({ ...pedido, status: newStatus })}
          value={pedido.status}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <RadioButton value="pendente" />
            <Text>Pendente</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <RadioButton value="em andamento" />
            <Text>Em andamento</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value="concluído" />
            <Text>Concluído</Text>
          </View>
        </RadioButton.Group>

        <Button mode="contained" onPress={salvarPedido} style={{ marginTop: 16, marginBottom: 24 }}>
          {editando ? 'Salvar Edição' : 'Salvar Pedido'}
        </Button>

        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
          Pedidos Salvos
        </Text>

        <Text variant="titleLarge" style={{ marginBottom: 16 }}>
          Total Entregues: R$ {calcularTotalEntregues()}
        </Text>

        {pedidos
          .filter((p) => !p.excluido)
          .map((p) => (
            <Card key={p.id} style={{ marginBottom: 8 }}>
              <Card.Content>
                <Text>Cliente: {p.cliente}</Text>
                <Text>Produto: {p.produto}</Text>
                <Text>Quantidade: {p.quantidade}</Text>
                <Text>Status: {p.status}</Text>
                <Text>Valor Unitário: R$ {parseFloat(p.valorProduto).toFixed(2)}</Text>
                <Text>Subtotal: R$ {(p.quantidade * p.valorProduto).toFixed(2)}</Text>
                {p.justificativaEdicao ? (
                  <Text>Justificativa da edição: {p.justificativaEdicao}</Text>
                ) : null}
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <Button
                    mode="outlined"
                    onPress={() => iniciarEdicao(p)}
                    style={{ marginRight: 8 }}
                  >
                    Editar
                  </Button>
                  <Button mode="outlined" onPress={() => solicitarExclusao(p)} textColor="red">
                    Excluir
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}

        <Portal>
          <Dialog visible={dialogJustificativaVisible} onDismiss={fecharDialogJustificativa}>
            <Dialog.Title>
              {acaoAtual === 'editar' ? 'Justificativa da edição' : 'Justificativa da exclusão'}
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Justificativa"
                value={justificativaTemp}
                onChangeText={setJustificativaTemp}
                multiline
                autoFocus
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={fecharDialogJustificativa}>Cancelar</Button>
              <Button onPress={confirmarJustificativa}>Confirmar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
