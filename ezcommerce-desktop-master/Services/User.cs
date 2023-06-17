using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Services
{
    public class User
    {
        public enum UserType
        {
            Customer = 1,
            Admin,
            Attendant,
            InventoryManager
        }

        public string? name { get; set; }
        public string? paternalSurname { get; set; }
        public string? maternalSurname { get; set; }
        public DateOnly? birthdate { get; set; }
        public string? email { get; set; }
        public string? phone { get; set; }
        public string? username { get; set; }
        public string? password { get; set; }
        public UserType? role { get; set; }
        public int active { get; set; }

        public User(string name, string paternalSurname, string maternalSurname, DateOnly birthDate, string email, string phone, string username, string? password, UserType type)
        {
            this.name = name;
            this.paternalSurname = paternalSurname;
            this.maternalSurname = maternalSurname;
            this.birthdate = birthDate;
            this.email = email;
            this.phone = phone;
            this.username = username;
            this.password = password;
            this.role = type;
        }

        public User()
        {
            
        }
    }
}
