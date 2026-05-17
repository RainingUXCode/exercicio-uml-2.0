from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import uuid

app = Flask(__name__)
CORS(app)  # Permite comunicação direta com o React

# Configuração da Conexão com a sua Instância Local do MySQL80
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',  # <-- Substitua pela sua senha do MySQL
    'database': 'sistema_loteria',
    'port': 3306
}

def obter_conexao():
    return mysql.connector.connect(**db_config)

# --- MÉTODOS DE REGRA DE NEGÓCIO DA MODELAGEM OO ---

# Método: validarAposta()
def validar_aposta(numeros_lista, qtd_permitida):
    # Regra: quantidade de números deve ser exata e não possuir duplicatas
    if len(numeros_lista) != qtd_permitida:
        return False, f"A aposta deve conter exatamente {qtd_permitida} números."
    
    if len(set(numeros_lista)) != len(numeros_lista):
        return False, "A aposta não pode conter números repetidos."
    
    if any(n < 1 or n > 60 for n in numeros_lista):
        return False, "Os números devem estar entre 1 e 60."
        
    return True, "Válido"

# --- ROTAS DA API HTTP (RF01, RF02, RF03, RF04) ---

@app.route('/api/jogos', methods=['GET'])
def listar_jogos():
    conn = obter_conexao()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM jogo")
    jogos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(jogos)

# RF01 – Cadastrar cartões apostados
@app.route('/api/cartoes', methods=['POST'])
def cadastrar_cartao():
    data = request.json
    jogo_id = data.get('jogo_id')
    concurso = int(data.get('concursoNumero'))
    data_aposta = data.get('dataAposta')
    numeros = sorted([int(x) for x in data.get('numeros', [])])
    
    conn = obter_conexao()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT qtdNumerosPermitidos FROM jogo WHERE id = %s", (jogo_id,))
    jogo = cursor.fetchone()
    
    if not jogo:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Jogo não localizado'}), 404
        
    valido, msg = validar_aposta(numeros, jogo['qtdNumerosPermitidos'])
    if not valido:
        cursor.close()
        conn.close()
        return jsonify({'error': msg}), 400
        
    num_str = ",".join(map(str, numeros))
    novo_id = str(uuid.uuid4())
    
    # Corrigido para numerosEscolhidos conforme o banco de dados
    cursor.execute(
        "INSERT INTO cartao_apostado (id, jogo_id, numerosEscolhidos, dataAposta, concursoNumero) VALUES (%s, %s, %s, %s, %s)",
        (novo_id, jogo_id, num_str, data_aposta, concurso)
    )
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Cartão apostado registrado com sucesso!'})

# RF02 – Registrar resultados do concurso
@app.route('/api/resultados', methods=['POST'])
def registrar_resultado():
    data = request.json
    jogo_id = data.get('jogo_id')
    concurso = int(data.get('concursoNumero'))
    data_sorteio = data.get('dataSorteio')
    valor_premio = float(data.get('valorPremio'))
    numeros = sorted([int(x) for x in data.get('numeros', [])])
    
    conn = obter_conexao()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT qtdNumerosPermitidos FROM jogo WHERE id = %s", (jogo_id,))
    jogo = cursor.fetchone()
    
    if not jogo:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Jogo não localizado'}), 404
        
    valido, msg = validar_aposta(numeros, jogo['qtdNumerosPermitidos'])
    if not valido:
        cursor.close()
        conn.close()
        return jsonify({'error': f"Resultado inválido: {msg}"}), 400
        
    num_str = ",".join(map(str, numeros))
    novo_id = str(uuid.uuid4())
    
    cursor.execute(
        "INSERT INTO concurso_resultado (id, jogo_id, concursoNumero, numeroSorteado, dataSorteio, valorPremio) VALUES (%s, %s, %s, %s, %s, %s)",
        (novo_id, jogo_id, concurso, num_str, data_sorteio, valor_premio)
    )
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Resultado oficial do concurso registrado!'})

# RF03 + RF04 (Conferência de Apostas + Relatório de Premiação)
@app.route('/api/conferência/<string:jogo_id>/<int:concurso>', methods=['GET'])
def conferir_apostas(jogo_id, concurso):
    conn = obter_conexao()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute(
        "SELECT numeroSorteado, valorPremio, dataSorteio FROM concurso_resultado WHERE jogo_id = %s AND concursoNumero = %s",
        (jogo_id, concurso)
    )
    resultado_oficial = cursor.fetchone()
    
    if not resultado_oficial:
        cursor.close()
        conn.close()
        return jsonify({
            'concursoRegistrado': False,
            'mensagem': f'O resultado oficial do concurso Nº {concurso} ainda não foi registrado no sistema.'
        })
        
    sorteados = set(int(x) for x in resultado_oficial['numeroSorteado'].split(','))
    
    # Corrigido para numerosEscolhidos conforme o banco de dados
    cursor.execute(
        "SELECT id, numerosEscolhidos, dataAposta FROM cartao_apostado WHERE jogo_id = %s AND concursoNumero = %s",
        (jogo_id, concurso)
    )
    cartoes_apostados = cursor.fetchall()
    
    relatorio_cartoes = []
    
    for cartao in cartoes_apostados:
        escolhidos = [int(x) for x in cartao['numerosEscolhidos'].split(',')]
        acertos = sorted(list(sorteados.intersection(escolhidos)))
        qtd_acertos = len(acertos)
        
        ganhou = False
        if qtd_acertos >= 4:
            ganhou = True
            
        relatorio_cartoes.append({
            'id': cartao['id'],
            'numerosApostados': escolhidos,
            'numerosAcertados': acertos,
            'qtdAcertos': qtd_acertos,
            'premiado': ganhou,
            'valorGanho': resultado_oficial['valorPremio'] if qtd_acertos == len(sorteados) else (resultado_oficial['valorPremio'] * 0.05 if ganhou else 0)
        })
        
    cursor.close()
    conn.close()
    
    return jsonify({
        'concursoRegistrado': True,
        'concursoNumero': concurso,
        'dataSorteio': resultado_oficial['dataSorteio'],
        'numerosOficiais': sorted(list(sorteados)),
        'valorMaximoPremio': resultado_oficial['valorPremio'],
        'cartoes': relatorio_cartoes
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)