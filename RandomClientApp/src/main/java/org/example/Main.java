package org.example;

import javax.json.Json;
import javax.json.JsonObject;
import java.net.HttpURLConnection;
import java.net.URL;

public class Main {

    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("Uso: java -jar main.jar <comando> <argumentos>");
            return;
        }

        String comando = args[0];

        switch (comando) {
            case "add_users":
                if (args.length < 3) {
                    System.out.println("Uso: java -jar main.jar add_users <quantidade>");
                    return;
                }
                int quantidadeUsuarios = Integer.parseInt(args[1]);
                adicionarUsuarios(quantidadeUsuarios);
                break;
            case "add_tasks":
                if (args.length < 4) {
                    System.out.println("Uso: java -jar main.jar add_tasks <usuario> <senha> <quantidade>");
                    return;
                }
                String usuario = args[1];
                String senha = args[2];
                int quantidadeTarefas = Integer.parseInt(args[3]);
                adicionarTarefas(usuario, senha, quantidadeTarefas);
                break;
            default:
                System.out.println("Comando inválido");
        }
    }

    private static void adicionarTarefas(String usuario, String senha, int quantidade) {
        try {
            for (int i = 0; i < quantidade; i++) {
                URL url = new URL("http://localhost:8080/backend/rest/users/" + usuario + "/tasks");
                HttpURLConnection con = (HttpURLConnection) url.openConnection();
                con.setRequestMethod("POST");
                con.setRequestProperty("Content-Type", "application/json");
                con.setRequestProperty("username", usuario);
                con.setRequestProperty("password", senha);

                JsonObject taskJson = Json.createObjectBuilder()
                        .add("title", "Tarefa " + i)
                        .add("description", "Descrição da tarefa " + i)
                        .add("priority", i)
                        .build();

                con.setDoOutput(true);
                con.getOutputStream().write(taskJson.toString().getBytes());

                int responseCode = con.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    System.out.println("Tarefa adicionada para " + usuario);
                } else {
                    System.out.println("Falha ao adicionar tarefa para " + usuario);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void adicionarUsuarios(int quantidade) {
        try {
            for (int i = 0; i < quantidade; i++) {
                URL url = new URL("http://localhost:8080/backend/rest/users/register");
                HttpURLConnection con = (HttpURLConnection) url.openConnection();
                con.setRequestMethod("POST");
                con.setRequestProperty("Content-Type", "application/json");

                JsonObject userJson = Json.createObjectBuilder()
                        .add("username", "user" + i)
                        .add("password", "password")
                        .add("email", "user" + i + "@example.com")
                        .add("firstName", "First Name " + i)
                        .add("lastName", "Last Name " + i)
                        .add("phoneNumber", "123456789" + i)
                        .build();

                con.setDoOutput(true);
                con.getOutputStream().write(userJson.toString().getBytes());

                int responseCode = con.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_CREATED) {
                    System.out.println("Usuário adicionado: user" + i);
                } else {
                    System.out.println("Falha ao adicionar usuário: user" + i);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}