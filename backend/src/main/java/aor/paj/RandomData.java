package aor.paj;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import aor.paj.bean.UserBean;
import aor.paj.dto.User;

public class RandomData {

    private static final String RANDOM_USER_API_URL = "https://randomuser.me/api/";
    private static final String BORED_API_URL = "https://www.boredapi.com/api/activity";
    private static final String FILE_PATH = "C:\\wildfly-30.0.1.Final\\bin\\users.json";

    public static void main(String[] args) throws IOException, InterruptedException {
        if (args.length < 2) {
            System.out.println("Uso: java -jar clientapp.jar <comando> <argumentos>");
            return;
        }

        String command = args[0];

        switch (command) {
            case "add_users":
                if (args.length != 2) {
                    System.out.println("Uso: java -jar clientapp.jar add_users <quantidade>");
                    return;
                }
                int numUsers = Integer.parseInt(args[1]);
                adicionarUsuarios(numUsers);
                break;
            case "add_tasks":
                if (args.length != 4) {
                    System.out.println("Uso: java -jar clientapp.jar add_tasks <username> <password> <quantidade>");
                    return;
                }
                String username = args[1];
                String password = args[2];
                int numTasks = Integer.parseInt(args[3]);
                adicionarTarefas(username, password, numTasks);
                break;
            default:
                System.out.println("Comando inválido");
        }
    }

    private static void adicionarTarefas(String usuario, String senha, int quantidade) {
        try {
            for (int i = 0; i < quantidade; i++) {
                // Chamada à API Boredapi para obter uma nova tarefa aleatória
                URL apiUrl = new URL(BORED_API_URL);
                HttpURLConnection connection = (HttpURLConnection) apiUrl.openConnection();
                connection.setRequestMethod("GET");

                int responseCode = connection.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    // Ler a resposta da API
                    String responseBody = connection.getResponseMessage();
                    System.out.println("Tarefa obtida: " + responseBody);


                    System.out.println("Tarefa adicionada para o usuário " + usuario);
                } else {
                    System.out.println("Falha ao obter tarefa aleatória. Código de resposta: " + responseCode);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void adicionarUsuarios(int quantidade) {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(RANDOM_USER_API_URL + "?results=" + quantidade))
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonReader jsonReader = Json.createReader(new StringReader(response.body()));
                JsonObject jsonResponse = jsonReader.readObject();

                if (jsonResponse.containsKey("results")) {
                    List<User> userList = new ArrayList<>();

                    jsonResponse.getJsonArray("results").forEach(result -> {
                        JsonObject userJson = (JsonObject) result;

                        String username = userJson.getJsonObject("login").getString("username");
                        String password = userJson.getJsonObject("login").getString("password");
                        String email = userJson.getString("email");
                        String firstName = userJson.getJsonObject("name").getString("first");
                        String lastName = userJson.getJsonObject("name").getString("last");
                        String phoneNumber = userJson.getString("phone");
                        String photo = userJson.getJsonObject("picture").getString("large");

                        User user = new User(username, password, email, firstName, lastName, phoneNumber, photo);
                        userList.add(user);
                    });

                    // Adicionar os usuários ao arquivo JSON

                    adicionarUsuariosAoJSON(userList);
                } else {
                    System.out.println("Erro ao processar a resposta da API Randomuser");
                }
            } else {
                System.out.println("Falha ao chamar a API Randomuser. Código de resposta: " + response.statusCode());
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static void adicionarUsuariosAoJSON(List<User> userList) {
        try (FileWriter fileWriter = new FileWriter(FILE_PATH)) {
            for (User user : userList) {
                UserBean userBean = new UserBean(FILE_PATH);
                userBean.addUser(user);
            }
            System.out.println("Usuários adicionados ao arquivo JSON com sucesso.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
