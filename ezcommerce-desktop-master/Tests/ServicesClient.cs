using Services;

namespace Tests
{
    public class Tests
    {
        [Test]
        public void TestAuthSuccess()
        {
            var client = Client.Instance;
            var authError = client.AuthenticateEmployee("admin", "#Admin01");
            Assert.That(authError.Result, Is.EqualTo(Client.Error.Success));
        }

        [Test]
        public void TestAuthInvalidCredentials()
        {
            var client = Client.Instance;
            var authError = client.AuthenticateEmployee("test", "Test1");
            Assert.That(authError.Result, Is.EqualTo(Client.Error.InvalidCredentials));
        }

        [Test]
        public void TestCreateUserSuccess()
        {
            var client = Client.Instance;
            var user = new User("Test", "Test", "Test", new DateOnly(2000, 1, 1), "test@tt.asd", "124567890", "testo", "Test1.", User.UserType.Admin);
            var result = client.AddUser(user).Result;
            var deleteResult = client.DeleteUser("testo").Result;
            Assert.That(result, Is.EqualTo(Client.Error.Success));
        }

        [Test]
        public void TestGetUsersSuccess()
        {
            var client = Client.Instance;
            var result = client.GetUsers().Result;
            var error = result.Item1;
            Assert.That(error, Is.EqualTo(Client.Error.Success));
        }

        [Test]
        public void TestDeleteUserSuccess()
        {
            var client = Client.Instance;
            var user = new User("Eep", "Eep", "Eep", new DateOnly(2002, 1, 1), "Eep@tt.asd", "124567890", "eep11", "Test2.", User.UserType.Attendant);
            var result = client.AddUser(user).Result;

            var deleteResult = Client.Instance.DeleteUser("eep11").Result;
            Assert.That(deleteResult, Is.EqualTo(Client.Error.Success));
        }

        [Test]
        public void TestDeleteUserNotFound()
        {
            var deleteResult = Client.Instance.DeleteUser("testo22").Result;
            Assert.That(deleteResult, Is.EqualTo(Client.Error.NotFound));
        }

        [Test]
        public void TestAddProduct()
        {
            var client = Client.Instance;
            var authError = client.AuthenticateEmployee("admin", "#Admin01");

            var product = new Product(1, "PUMA RICKIE INF BLANCO", 1, 1, 1, 1);
            var result = client.AddProduct(product).Result;

            Assert.That(result.Item1, Is.EqualTo(Client.Error.Success));
            var deleteResult = client.DeleteProduct(result.Item2.id).Result;
        }

        [Test]
        public void TestGetProducts()
        {
            var client = Client.Instance;
            var result = client.GetProducts().Result;
            var error = result.Item1;
            Assert.That(error, Is.EqualTo(Client.Error.Success));
        }

        [Test]
        public void TestGetProduct()
        {
            var client = Client.Instance;
            var result = client.GetProduct(39).Result;
            var error = result.Item1;
            Assert.That(error, Is.EqualTo(Client.Error.Success));
        }

        [Test]
        public void TestGetCategorySuccess()
        {
            var client = Client.Instance;
            var result = client.GetCategory(1).Result;
            var error = result.Item1;
            Assert.That(error, Is.EqualTo(Client.Error.Success));
        }

        [Test]
        public void TestGetCategoriesSuccess()
        {
            var client = Client.Instance;
            var result = client.GetCategories().Result;
            var error = result.Item1;
            Assert.That(error, Is.EqualTo(Client.Error.Success));
        }

        [Test]
        public void TestGetBrandSuccess()
        {
            var client = Client.Instance;
            var result = client.GetBrand(1).Result;
            var error = result.Item1;
            Assert.That(error, Is.EqualTo(Client.Error.Success));
        }

        [Test]
        public void TestGetBrandsSuccess()
        {
            var client = Client.Instance;
            var result = client.GetBrands().Result;
            var error = result.Item1;
            Assert.That(error, Is.EqualTo(Client.Error.Success));
        }

        [Test]
        public void TestGetPurchasesSuccess()
        {
            var client = Client.Instance;
            var result = client.GetPurchases().Result;
            var error = result.Item1;
            Assert.That(error, Is.EqualTo(Client.Error.Success));
        }
    }
}