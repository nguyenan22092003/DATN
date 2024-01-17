using BeautyPoly.Common;
using BeautyPoly.DBContext;
using BeautyPoly.Models;



namespace BeautyPoly.Data.Repositories
{
    public class LoginAccountRepository
    {
        BeautyPolyDbContext _dbContext;
        public LoginAccountRepository(BeautyPolyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Accounts LoginAccount(Accounts accounts)
        {
            Accounts temp = new Accounts();
            try
            {
                string password = string.IsNullOrEmpty(accounts.Password) ? "" : MaHoaMD5.EncryptPassword(accounts.Password);
                temp = _dbContext.Accounts.Where(c => c.Email == accounts.Email && c.Password == password).FirstOrDefault();
                if (temp != null)
                {

                    return temp;//Đăng nhập thành công
                }
                else
                {
                    return temp; //Email hoặc mật khẩu không chính xác
                }
            }
            catch
            {

                return temp;
            }

        }

        public int CreateCustomer(PotentialCustomer customer)
        {
            try
            {
                string password = string.IsNullOrEmpty(customer.Password) ? "" : MaHoaMD5.EncryptPassword(customer.Password);
                string code = MaHoaMD5.ShortenName(customer.FullName);
                var temp = _dbContext.PotentialCustomers.Where(c => c.Email == customer.Email.ToLower()).ToList();
                var phone = _dbContext.PotentialCustomers.Where(c => c.Phone == customer.Phone).ToList();
                if (temp.Count < 1 && phone.Count < 1)
                {
                    customer.PotentialCustomerCode = code;
                    customer.CreateDate = DateTime.Now;
                    customer.Avatar = "default.jpg";
                    customer.Password = password;
                    customer.IsActive = true;
                    _dbContext.PotentialCustomers.Add(customer);
                    _dbContext.SaveChanges();
                    return 1;//Đăng ký thành công
                }
                else
                {
                    return 2; //Tài khoản đã tồn tại
                }
            }
            catch
            {

                return 0;
            }

        }

        public PotentialCustomer Login(PotentialCustomer customer)
        {
            PotentialCustomer temp = new PotentialCustomer();
            try
            {
                string password = string.IsNullOrEmpty(customer.Password) ? "" : MaHoaMD5.EncryptPassword(customer.Password);
                temp = _dbContext.PotentialCustomers.Where(c => c.Email == customer.Email && c.Password == password).FirstOrDefault();
                if (temp != null)
                {
                    return temp;//Đăng nhập thành công
                }
                else
                {
                    return temp; //Email hoặc mật khẩu không chính xác
                }
            }
            catch
            {
                return temp;
            }

        }
    }
}
