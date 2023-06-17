using static System.Net.HttpStatusCode;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text;
using System.Configuration;
using System.Data;
using System.Linq;

namespace Services
{
    public partial class Client
    {
        private readonly static Client _instance = new Client();

        public string? _username;
        public string? _token;

        public static Client Instance
        {
            get
            {
                return _instance;
            }
        }

        public string Username
        {
            get
            {
                return _username;
            }
        }

        private static string ApiUrlBase
        {
            get
            {
                return "http://localhost:8080/api";
            }
        }

        private Client()
        {
        }

        public enum Error
        {
            Success,
            InvalidData,
            InvalidCredentials,
            Unauthorized,
            NotFound,
            ConnectionError,
            AlreadyExists,
            ServerError,
            ClientError,
            UnknownError
        }

        public async Task<Error> AuthenticateEmployee(string username, string password)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/auth/employee/{1}", ApiUrlBase, username);
                    var credentials = new AuthCredentials(username, password);
                    var requestBody = new StringContent(JsonSerializer.Serialize(credentials), Encoding.UTF8, "application/json");
                    var responseMessage = client.PostAsync(url, requestBody).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            var response = await responseMessage.Content.ReadFromJsonAsync<AuthResponse>();
                            if (response != null)
                            {
                                _token = response.token;
                                _username = username;
                                return Error.Success;
                            }
                            else
                            {
                                return Error.ServerError;
                            }
                        }
                        else if (responseMessage.StatusCode == Unauthorized || responseMessage.StatusCode == NotFound)
                        {
                            return Error.InvalidCredentials;
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return Error.ServerError;
                        }
                    }
                    return Error.ConnectionError;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error" + e.Message);
                return Error.ClientError;
            }
        }

        public async Task<Error> AddUser(User user)
        {
            if (_token == null)
            {
                return Error.Unauthorized;
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/users/{1}", ApiUrlBase, user.username);
                    var requestBody = new StringContent(JsonSerializer.Serialize(user), Encoding.UTF8, "application/json");
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.PostAsync(url, requestBody).Result;

                    if (responseMessage != null)
                    {
                        // map response to key value pair list
                        var response = await responseMessage.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                        if (response != null && response.ContainsKey("message"))
                        {
                            Console.WriteLine(response["message"]);
                        }

                        if (responseMessage.IsSuccessStatusCode)
                        {
                            return Error.Success;
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return Error.Unauthorized;
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return Error.ServerError;
                        }
                        else if (responseMessage.StatusCode == BadRequest)
                        {
                            return Error.InvalidData;
                        }
                    }
                    return Error.ServerError;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Error.ClientError;
            }
        }

        public async Task<(Error, List<User>?)> GetUsers()
        {
            if (_token == null)
            {
                return (Error.Unauthorized, null);
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/users", ApiUrlBase);
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.GetAsync(url).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            var users = await responseMessage.Content.ReadFromJsonAsync<List<User>>();
                            return (Error.Success, users);
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return (Error.Unauthorized, null);
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return (Error.ServerError, null);
                        }
                    }
                    return (Error.ServerError, null);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return (Error.ClientError, null);
            }
        }

        public async Task<Error> DeleteUser(string username)
        {
            if (_token == null)
            {
                return Error.Unauthorized;
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/users/{1}", ApiUrlBase, username);
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.DeleteAsync(url).Result;

                    if (responseMessage != null)
                    {
                        // map response to key value pair list
                        var response = await responseMessage.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                        if (response != null && response.ContainsKey("message"))
                        {
                            Console.WriteLine(response["message"]);
                        }

                        if (responseMessage.IsSuccessStatusCode)
                        {
                            return Error.Success;
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return Error.Unauthorized;
                        }
                        else if (responseMessage.StatusCode == NotFound)
                        {
                            return Error.NotFound;
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return Error.ServerError;
                        }
                    }
                    return Error.ServerError;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Error.ClientError;
            }
        }

        public async Task<Error> UpdateUser(string username, User user)
        {
            if (_token == null)
            {
                return Error.Unauthorized;
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/users/{1}", ApiUrlBase, username);
                    var requestBody = new StringContent(JsonSerializer.Serialize(user), Encoding.UTF8, "application/json");
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.PutAsync(url, requestBody).Result;

                    if (responseMessage != null)
                    {
                        // map response to key value pair list
                        var response = await responseMessage.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                        if (response != null && response.ContainsKey("message"))
                        {
                            Console.WriteLine(response["message"]);
                        }

                        if (responseMessage.IsSuccessStatusCode)
                        {
                            return Error.Success;
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return Error.Unauthorized;
                        }
                        else if (responseMessage.StatusCode == NotFound)
                        {
                            return Error.NotFound;
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return Error.ServerError;
                        }
                        else if (responseMessage.StatusCode == BadRequest)
                        {
                            return Error.InvalidData;
                        }
                    }
                    return Error.ServerError;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Error.ClientError;
            }
        }

        public async Task<(Error, Product?)> AddProduct(Product product)
        {
            if (_token == null)
            {
                return (Error.Unauthorized, null);
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/products", ApiUrlBase);
                    var requestBody = new StringContent(JsonSerializer.Serialize(product), Encoding.UTF8, "application/json");
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.PostAsync(url, requestBody).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            var res = await responseMessage.Content.ReadFromJsonAsync<AddProductResponse>();
                            Console.WriteLine(res.message);
                            return (Error.Success, res.newProduct);
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return (Error.Unauthorized, null);
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return (Error.ServerError, null);
                        }
                        else if (responseMessage.StatusCode == BadRequest)
                        {
                            return (Error.InvalidData, null);
                        }
                    }
                    return (Error.ServerError, null);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return (Error.ClientError, null);
            }
        }

        public async Task<(Error, List<Product>?)> GetProducts() {
            if (_token == null)
            {
                return (Error.Unauthorized, null);
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/products", ApiUrlBase);
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.GetAsync(url).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            var products = await responseMessage.Content.ReadFromJsonAsync<List<Product>>();
                            return (Error.Success, products);
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return (Error.Unauthorized, null);
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return (Error.ServerError, null);
                        }
                    }
                    return (Error.ServerError, null);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return (Error.ClientError, null);
            }
        }

        public async Task<(Error, Product?)> GetProduct(int id)
        {
            if (_token == null)
            {
                return (Error.Unauthorized, null);
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/products/{1}", ApiUrlBase, id);
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.GetAsync(url).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            var product = await responseMessage.Content.ReadFromJsonAsync<Product>();
                            return (Error.Success, product);
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return (Error.Unauthorized, null);
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return (Error.ServerError, null);
                        }
                        else if (responseMessage.StatusCode == NotFound)
                        {
                            return (Error.NotFound, null);
                        }
                    }
                    return (Error.ServerError, null);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return (Error.ClientError, null);
            }
        }

        public async Task<Error> DeleteProduct(int id)
        {
            if (_token == null)
            {
                return Error.Unauthorized;
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/products/{1}", ApiUrlBase, id);
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.DeleteAsync(url).Result;

                    if (responseMessage != null)
                    {
                        // map response to key value pair list
                        var response = await responseMessage.Content.ReadFromJsonAsync<Dictionary<string, string>>();
                        if (response != null && response.ContainsKey("message"))
                        {
                            Console.WriteLine(response["message"]);
                        }

                        if (responseMessage.IsSuccessStatusCode)
                        {
                            return Error.Success;
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return Error.Unauthorized;
                        }
                        else if (responseMessage.StatusCode == NotFound)
                        {
                            return Error.NotFound;
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return Error.ServerError;
                        }
                    }
                    return Error.ServerError;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Error.ClientError;
            }
        }

        public async Task<Error> UpdateProduct(Product product)
        {
            if (_token == null)
            {
                return Error.Unauthorized;
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/products/{1}", ApiUrlBase, product.id);
                    var requestBody = new StringContent(JsonSerializer.Serialize(product), Encoding.UTF8, "application/json");
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.PutAsync(url, requestBody).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            return Error.Success;
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return Error.Unauthorized;
                        }
                        else if (responseMessage.StatusCode == NotFound)
                        {
                            return Error.NotFound;
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return Error.ServerError;
                        }
                        else if (responseMessage.StatusCode == BadRequest)
                        {
                            return Error.InvalidData;
                        }
                    }
                    return Error.ServerError;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return Error.ClientError;
            }
        }

        public async Task<(Error, Category?)> GetCategory(int id)
        {
            if (_token == null)
            {
                return (Error.Unauthorized, null);
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/categories/{1}", ApiUrlBase, id);
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.GetAsync(url).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            var category = await responseMessage.Content.ReadFromJsonAsync<Category>();
                            return (Error.Success, category);
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return (Error.Unauthorized, null);
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return (Error.ServerError, null);
                        }
                        else if (responseMessage.StatusCode == NotFound)
                        {
                            return (Error.NotFound, null);
                        }
                        else if (responseMessage.StatusCode == BadRequest)
                        {
                            return (Error.InvalidData, null);
                        }
                    }
                    return (Error.ServerError, null);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return (Error.ClientError, null);
            }
        }

        public async Task<(Error, List<Category>?)> GetCategories()
        {
              if (_token == null)
            {
                return (Error.Unauthorized, null);
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/categories", ApiUrlBase);
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.GetAsync(url).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            var categories = await responseMessage.Content.ReadFromJsonAsync<List<Category>>();
                            return (Error.Success, categories);
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return (Error.Unauthorized, null);
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return (Error.ServerError, null);
                        }
                    }
                    return (Error.ServerError, null);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return (Error.ClientError, null);
            }
        }

        public async Task<(Error, Brand?)> GetBrand(int id)
        {
            if (_token == null)
            {
                return (Error.Unauthorized, null);
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/brands/{1}", ApiUrlBase, id);
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.GetAsync(url).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            var brand = await responseMessage.Content.ReadFromJsonAsync<Brand>();
                            return (Error.Success, brand);
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return (Error.Unauthorized, null);
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return (Error.ServerError, null);
                        }
                        else if (responseMessage.StatusCode == NotFound)
                        {
                            return (Error.NotFound, null);
                        }
                        else if (responseMessage.StatusCode == BadRequest)
                        {
                            return (Error.InvalidData, null);
                        }
                    }
                    return (Error.ServerError, null);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return (Error.ClientError, null);
            }
        }

        public async Task<(Error, List<Brand>?)> GetBrands()
        {
            if (_token == null)
            {
                return (Error.Unauthorized, null);
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/brands", ApiUrlBase);
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.GetAsync(url).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            var brands = await responseMessage.Content.ReadFromJsonAsync<List<Brand>>();
                            return (Error.Success, brands);
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return (Error.Unauthorized, null);
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return (Error.ServerError, null);
                        }
                    }
                    return (Error.ServerError, null);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return (Error.ClientError, null);
            }
        }

        public async Task<(Error, List<Purchase>?)> GetPurchases()
        {
            if (_token == null)
            {
                return (Error.Unauthorized, null);
            }

            try
            {
                using (var client = new HttpClient())
                {
                    var url = string.Format("{0}/purchases", ApiUrlBase);
                    client.DefaultRequestHeaders.Add("Authorization", string.Format("Bearer {0}", _token));
                    var responseMessage = client.GetAsync(url).Result;

                    if (responseMessage != null)
                    {
                        if (responseMessage.IsSuccessStatusCode)
                        {
                            var purchases = await responseMessage.Content.ReadFromJsonAsync<List<Purchase>>();
                            return (Error.Success, purchases);
                        }
                        else if (responseMessage.StatusCode == Unauthorized)
                        {
                            return (Error.Unauthorized, null);
                        }
                        else if (responseMessage.StatusCode == InternalServerError)
                        {
                            return (Error.ServerError, null);
                        }
                    }
                    return (Error.ServerError, null);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return (Error.ClientError, null);
            }
        }
    }
}