import { collection, DocumentReference, QueryDocumentSnapshot, SnapshotOptions } from "@firebase/firestore";
import Cliente from "../../core/Cliente";
import ClienteRepositorio from "../../core/ClienteRepositorio";
import firebase from "../config";

export default class ColecaoCliente implements ClienteRepositorio {
    
    #conversor = {
        toFirestore(cliente: Cliente) {
            return {
                nome: cliente.nome,
                idade: cliente.idade,
            }
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions ) {
            const dados = snapshot.data(options)
            return new Cliente(dados.nome, dados.idade, snapshot.id)
        }
    }
    
    async salvar(cliente: Cliente): Promise<Cliente> {
        if (cliente?.id) {
            await this.colecao().doc(cliente.id).set(cliente)
            return cliente
        }else {
            const docRef = await this.colecao().add(cliente)
            const doc = await docRef.get()
            return doc.data()
        }
    }
    async excluir(cliente: Cliente): Promise<void> {
        return this.colecao().doc(cliente.id).delete()
    }
    async obterTodos(): Promise<Cliente[]> {
        const query = await this.colecao()
        return query.docs.map(doc => doc.data()) ?? []
    }

    private colecao() {
        return collection(this.colecao(),'cliente').withConverter(this.#conversor)
    }

}