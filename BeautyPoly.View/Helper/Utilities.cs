using System.Drawing;
using System.Drawing.Imaging;
using System.Text;
using System.Text.RegularExpressions;

namespace BeautyPoly.Helper
{
    public static class Utilities
    {
        public static string StripHTML(string input)
        {
            try
            {
                if (!string.IsNullOrEmpty(input))
                {
                    return Regex.Replace(input, "<.*?>", String.Empty);
                }
            }
            catch
            {
                return null;
            }
            return null;
        }
        public static bool IsValidEmail(string email)
        {
            if (email.Trim().EndsWith("."))
            {
                return false;
            }
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public static int PAGE_SIZE = 20;

        public static string ToTitleCase(string str)
        {
            string result = str;
            if (!string.IsNullOrEmpty(str))
            {
                var words = str.Split(' ');
                for (int index = 0; index < words.Length; index++)
                {
                    var s = words[index];
                    if (s.Length > 0)
                    {
                        words[index] = s[0].ToString().ToUpper() + s.Substring(1);
                    }
                }
                result = string.Join(" ", words);
            }
            return result;
        }
        public static bool IsInteger(string str)
        {
            Regex regex = new Regex(@"^[0-9]+$");

            try
            {
                if (String.IsNullOrWhiteSpace(str))
                {
                    return false;
                }
                if (!regex.IsMatch(str))
                {
                    return false;
                }

                return true;

            }
            catch
            {

            }
            return false;

        }
        public static string GetRandomKey(int length = 5)
        {
            //chuỗi mẫu (pattern)
            string pattern = @"0123456789zxcvbnmasdfghjklqwertyuiop[]{}:~!@#$%^&*()+";
            Random rd = new Random();
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < length; i++)
            {
                sb.Append(pattern[rd.Next(0, pattern.Length)]);
            }

            return sb.ToString();
        }
        public static string SEOUrl(string url)
        {
            url = url.ToLower();
            url = Regex.Replace(url, @"[áàạảãâấầậẩẫăắằặẳẵ]", "a");
            url = Regex.Replace(url, @"[éèẹẻẽêếềệểễ]", "e");
            url = Regex.Replace(url, @"[óòọỏõôốồộổỗơớờợởỡ]", "o");
            url = Regex.Replace(url, @"[íìịỉĩ]", "i");
            url = Regex.Replace(url, @"[ýỳỵỉỹ]", "y");
            url = Regex.Replace(url, @"[úùụủũưứừựửữ]", "u");
            url = Regex.Replace(url, @"[đ]", "d");

            //2. Chỉ cho phép nhận:[0-9a-z-\s]
            url = Regex.Replace(url.Trim(), @"[^0-9a-z-\s]", "").Trim();
            //xử lý nhiều hơn 1 khoảng trắng --> 1 kt
            url = Regex.Replace(url.Trim(), @"\s+", "-");
            //thay khoảng trắng bằng -
            url = Regex.Replace(url, @"\s", "-");
            while (true)
            {
                if (url.IndexOf("--") != -1)
                {
                    url = url.Replace("--", "-");
                }
                else
                {
                    break;
                }
            }
            return url;
        }
        public static void CreateIfMissing(string path)
        {
            bool folderExists = Directory.Exists(path);
            if (!folderExists)
                Directory.CreateDirectory(path);
        }
        public static async Task<string> UploadFile(Microsoft.AspNetCore.Http.IFormFile file, string sDirectory, string newname = null)
        {
            try
            {
                if (newname == null) newname = file.FileName;
                string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", sDirectory);
                CreateIfMissing(path);
                string pathFile = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", sDirectory, newname);
                var supportedTypes = new[] { "jpg", "jpeg", "png", "gif", "jfif", "webp" };
                var fileExt = System.IO.Path.GetExtension(file.FileName).Substring(1);
                if (!supportedTypes.Contains(fileExt.ToLower()))
                {
                    return null;
                }
                else
                {
                    using (var stream = new FileStream(pathFile, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    return newname;
                }
            }
            catch
            {
                return null;
            }
        }
        public static string UploadFile(string srcPath, string sDirectory, string newname = null)
        {
            try
            {
                if (newname == null) newname = Path.GetFileName(srcPath);
                string destinationPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", sDirectory);
                CreateIfMissing(destinationPath);
                string destinationFilePath = Path.Combine(destinationPath, newname);
                var supportedTypes = new[] { "jpg", "jpeg", "png", "gif", "jfif", "webp" };
                var fileExt = Path.GetExtension(srcPath).Substring(1);
                if (!supportedTypes.Contains(fileExt.ToLower()))
                {
                    return null;
                }
                else
                {
                    File.Copy(srcPath, destinationFilePath, true);
                    return newname;
                }
            }
            catch
            {
                return null;
            }
        }
        public static string ConvertAndSaveImage(string base64String, string fileName)
        {
            try
            {
                string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);
                CreateIfMissing(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images"));

                string[] base64Parts = base64String.Split(',');
                if (base64Parts.Length == 2)
                {
                    string imageType = base64Parts[0].Split(';')[0].Split(':')[1];
                    string base64 = base64Parts[1];
                    byte[] imageBytes = Convert.FromBase64String(base64.Trim());

                    using (MemoryStream ms = new MemoryStream(imageBytes))
                    {
                        Image image = Image.FromStream(ms);
                        ImageFormat imageFormat = GetImageFormat(imageType);
                        if (imageFormat != null)
                        {
                            string extension = GetImageFileExtension(imageFormat);
                            string newPath = Path.ChangeExtension(path, extension);
                            image.Save(newPath, imageFormat);
                            return Path.GetFileName(newPath);
                        }
                        else
                        {
                            return "";
                        }
                    }
                }
                return "";
            }
            catch (Exception ex)
            {
                return "";
            }
        }
        private static string GetImageFileExtension(ImageFormat imageFormat)
        {
            if (imageFormat == ImageFormat.Jpeg)
            {
                return "jpg";
            }
            else if (imageFormat == ImageFormat.Png)
            {
                return "png";
            }
            else if (imageFormat == ImageFormat.Gif)
            {
                return "gif";
            }
            else if (imageFormat == ImageFormat.Bmp)
            {
                return "bmp";
            }
            else if (imageFormat == ImageFormat.Tiff)
            {
                return "tiff";
            }
            else if (imageFormat == ImageFormat.Icon)
            {
                return "ico";
            }
            else
            {
                return string.Empty;
            }
        }

        private static ImageFormat GetImageFormat(string imageType)
        {
            switch (imageType)
            {
                case "image/jpeg":
                    return ImageFormat.Jpeg;
                case "image/jpg":
                    return ImageFormat.Jpeg;
                case "image/png":
                    return ImageFormat.Png;
                case "image/gif":
                    return ImageFormat.Gif;
                case "image/bmp":
                    return ImageFormat.Bmp;
                case "image/tiff":
                    return ImageFormat.Tiff;
                case "image/x-icon":
                    return ImageFormat.Icon;
                case "image/svg+xml":
                    return null;
                default:
                    return null;
            }
        }

       
    }
}
