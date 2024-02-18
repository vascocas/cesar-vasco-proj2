package aor.paj;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.util.ArrayList;
import aor.paj.dto.Task;
import aor.paj.bean.UserBean;
import aor.paj.dto.User;
import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

public class RandomData {

    private static final String RANDOM_USER_API_URL = "https://randomuser.me/api/";
    private static final String BORED_API_URL = "https://www.boredapi.com/api/activity";
    private static final String FILE_PATH = "C:\\wildfly-30.0.1.Final\\bin\\users.json";

    public static void main(String[] args) throws IOException, InterruptedException {
        if (args.length < 2) {
            System.out.println("Argumentos insuficientes");
            return;
        }

        UserBean userBean = new UserBean(FILE_PATH); // leitura do ficheiro json

        String command = args[0];

        switch (command) {
            case "add_users":
                if (args.length != 2) {
                    System.out.println("Uso: java -jar clientapp.jar add_users <quantidade>");
                    return;
                }
                int numUsers = Integer.parseInt(args[1]);
                adicionarUsuarios(numUsers, userBean);
                break;
            case "add_tasks":
                if (args.length != 4) {
                    System.out.println("Uso: java -jar clientapp.jar add_tasks <username> <password> <quantidade>");
                    return;
                }
                String username = args[1];
                String password = args[2];
                int numTasks = Integer.parseInt(args[3]);
                adicionarTarefas(username, password, numTasks, userBean);
                break;
            default:
                System.out.println("Comando inválido");
        }
    }

    /**
     *
     * @param user
     * @param password
     * @param quantidade
     * @param userBean
     */
    private static void adicionarTarefas(String user, String password, int quantidade, UserBean userBean) {
        try {
            for (int i = 0; i < quantidade; i++) {
                // Chamada à API Boredapi para obter uma nova tarefa aleatória
                URL apiUrl = new URL(BORED_API_URL);
                HttpURLConnection connection = (HttpURLConnection) apiUrl.openConnection();
                connection.setRequestMethod("GET");

                int responseCode = connection.getResponseCode();
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    // Ler a resposta da API
                    BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    StringBuilder responseBody = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        responseBody.append(line);
                    }
                    reader.close();

                    // Analisar a resposta JSON
                    JsonObject jsonObject = Json.createReader(new StringReader(responseBody.toString())).readObject();
                    String tarefa = jsonObject.getString("activity");

                    // Criar uma nova instância de Task com os dados obtidos da API
                    Task task = new Task(tarefa, "", 100, LocalDate.now(), LocalDate.now().plusDays(1));

                    // Adicionar a tarefa ao user
                    userBean.addTaskUser(user, task);

                    System.out.println("Tarefa adicionada a " + user);
                } else {
                    System.out.println("Falha ao obter tarefa aleatória. Código de resposta: " + responseCode);
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     *
     * @param quantidade
     * @param userBean
     */
    private static void adicionarUsuarios(int quantidade, UserBean userBean) {
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
                    JsonArray resultsArray = jsonResponse.getJsonArray("results");

                    ArrayList<User> userList = new ArrayList<>();

                    resultsArray.forEach(result -> {
                        JsonObject userJson = (JsonObject) result;

                        //Grava informação da API
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
                    adicionarUsuariosAoJSON(userList, userBean);
                } else {
                    System.out.println("Erro ao processar a resposta da API Randomuser: 'results' não encontrado");
                }
            } else {
                System.out.println("Falha ao chamar a API Randomuser. Código de resposta: " + response.statusCode());
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    /**
     *
     * @param userList
     * @param userBean
     */
    private static void adicionarUsuariosAoJSON(ArrayList<User> userList, UserBean userBean) {
        for (User user : userList) {
            userBean.addUser(user); // Adicionar cada usuário à instância de UserBean
        }
        System.out.println("Usuários adicionados ao arquivo JSON com sucesso.");
    }

}
