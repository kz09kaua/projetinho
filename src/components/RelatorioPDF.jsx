// src/components/RelatorioPDF.jsx
import { Page, Document, StyleSheet, View, Text } from '@react-pdf/renderer';

// Estilos sem fontes externas (usa Helvetica padrão)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: 1,
    borderBottomColor: '#0057B8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#0057B8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSymbol: {
    fontSize: 20,
    color: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1c1e',
  },
  subtitle: {
    fontSize: 9,
    color: '#727784',
    marginTop: 4,
  },
  dateText: {
    fontSize: 9,
    color: '#727784',
    textAlign: 'right',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#f9f9fc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e2e5',
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#727784',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1c1e',
    marginBottom: 4,
  },
  cardChange: {
    fontSize: 9,
    color: '#2e7d32',
  },
  progressBar: {
    marginTop: 8,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 15,
    color: '#1a1c1e',
  },
  queueTable: {
    marginBottom: 25,
  },
  queueHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e5',
  },
  queueHeaderCell: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#424752',
  },
  queueRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e5',
  },
  queueCell: {
    flex: 1,
    fontSize: 9,
    color: '#1a1c1e',
  },
  chartContainer: {
    marginBottom: 25,
    backgroundColor: '#f9f9fc',
    padding: 12,
    borderRadius: 12,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginTop: 10,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 30,
    backgroundColor: '#0057B8',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 8,
    marginTop: 6,
    color: '#727784',
  },
  footer: {
    marginTop: 40,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e2e5',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#727784',
  },
});

const RelatorioPDF = ({ dados }) => {
  const hoje = new Date().toLocaleDateString('pt-BR');
  const hora = new Date().toLocaleTimeString('pt-BR');
  const codigoRelatorio = `UBS-${Date.now().toString().slice(-8)}`;

  const fluxoHoras = ['08h', '10h', '12h', '14h', '16h'];
  const fluxoValores = [40, 55, 70, 95, 80];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              <Text style={styles.logoSymbol}>🏥</Text>
            </View>
            <View>
              <Text style={styles.title}>Relatório de Gestão - UBS</Text>
              <Text style={styles.subtitle}>Painel do Administrador</Text>
            </View>
          </View>
          <View>
            <Text style={styles.dateText}>
              Gerado em: {hoje} às {hora}
            </Text>
            <Text style={styles.dateText}>Código: {codigoRelatorio}</Text>
          </View>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Aguardando Agora</Text>
            <Text style={styles.cardValue}>{dados.aguardando}</Text>
            <Text style={styles.cardChange}>{dados.variacao}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Média de Espera</Text>
            <Text style={styles.cardValue}>{dados.mediaEspera} min</Text>
            <View style={styles.progressBar}>
              <View style={{ width: `${dados.percentualFila}%`, height: 4, backgroundColor: '#ffb300', borderRadius: 2 }} />
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Médicos Ativos</Text>
            <Text style={styles.cardValue}>{dados.medicosAtivos} / 10</Text>
            <Text style={{ fontSize: 8, color: '#727784' }}>Capacidade {dados.capacidade}%</Text>
          </View>
        </View>

        {/* Tabela de fila */}
        <Text style={styles.sectionTitle}>📋 Fila de Atendimento</Text>
        <View style={styles.queueTable}>
          <View style={styles.queueHeader}>
            <Text style={styles.queueHeaderCell}>Paciente</Text>
            <Text style={styles.queueHeaderCell}>Senha</Text>
            <Text style={styles.queueHeaderCell}>Tempo</Text>
            <Text style={styles.queueHeaderCell}>Status</Text>
          </View>
          {dados.fila.map((item, idx) => (
            <View key={idx} style={styles.queueRow}>
              <Text style={styles.queueCell}>{item.nome}</Text>
              <Text style={styles.queueCell}>{item.senha}</Text>
              <Text style={styles.queueCell}>{item.tempo}</Text>
              <Text style={[styles.queueCell, item.status === 'Chamando' && { color: '#0057B8', fontWeight: 'bold' }]}>
                {item.status}
              </Text>
            </View>
          ))}
        </View>

        {/* Gráfico de fluxo */}
        <Text style={styles.sectionTitle}>📊 Fluxo de Atendimento (últimas 5 horas)</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {fluxoValores.map((valor, idx) => (
              <View key={idx} style={styles.barWrapper}>
                <View style={[styles.bar, { height: `${valor}%` }]} />
                <Text style={styles.barLabel}>{fluxoHoras[idx]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Minha UBS - Sistema de Gestão de Saúde Pública</Text>
          <Text style={styles.footerText}>Documento gerado eletronicamente</Text>
        </View>
      </Page>
    </Document>
  );
};

export default RelatorioPDF;