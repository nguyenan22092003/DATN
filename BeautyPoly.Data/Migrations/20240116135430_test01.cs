using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyPoly.Data.Migrations
{
    public partial class test01 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CateID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CateCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    CateName = table.Column<string>(type: "nvarchar(150)", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CateID);
                });

            migrationBuilder.CreateTable(
                name: "Coupons",
                columns: table => new
                {
                    CouponID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CouponCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DiscountValue = table.Column<int>(type: "int", nullable: true),
                    CouponName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    CouponType = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coupons", x => x.CouponID);
                });

            migrationBuilder.CreateTable(
                name: "Options",
                columns: table => new
                {
                    OptionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OptionCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    OptionName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true),
                    IsPublish = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Options", x => x.OptionID);
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    PostsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PostsCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Contents = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Img = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsPublished = table.Column<bool>(type: "bit", nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    ShortContents = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Author = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Alias = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    IsHot = table.Column<bool>(type: "bit", nullable: true),
                    IsNewFeed = table.Column<bool>(type: "bit", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.PostsID);
                });

            migrationBuilder.CreateTable(
                name: "PotentialCustomers",
                columns: table => new
                {
                    PotentialCustomerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PotentialCustomerCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Birthday = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Avatar = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true),
                    ResetPasswordcode = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PotentialCustomers", x => x.PotentialCustomerID);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    RoleName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "Sale",
                columns: table => new
                {
                    SaleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SaleCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    SaleName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DiscountValue = table.Column<int>(type: "int", nullable: true),
                    SaleType = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sale", x => x.SaleID);
                });

            migrationBuilder.CreateTable(
                name: "TransactStatuses",
                columns: table => new
                {
                    TransactStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TransactStatusCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatusName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactStatuses", x => x.TransactStatusID);
                });

            migrationBuilder.CreateTable(
                name: "Vouchers",
                columns: table => new
                {
                    VoucherID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VoucherCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    VoucherName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MinValue = table.Column<int>(type: "int", nullable: true),
                    DiscountValue = table.Column<int>(type: "int", nullable: true),
                    MaxValue = table.Column<int>(type: "int", nullable: true),
                    VoucherType = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    UseQuantity = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vouchers", x => x.VoucherID);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    ProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CateID = table.Column<int>(type: "int", nullable: true),
                    ProductName = table.Column<string>(type: "nvarchar(150)", nullable: true),
                    ProductCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ModifiledDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.ProductID);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CateID",
                        column: x => x.CateID,
                        principalTable: "Categories",
                        principalColumn: "CateID");
                });

            migrationBuilder.CreateTable(
                name: "OptionValues",
                columns: table => new
                {
                    OptionValueID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OptionID = table.Column<int>(type: "int", nullable: true),
                    OptionValueCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    OptionValueName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true),
                    IsPublish = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OptionValues", x => x.OptionValueID);
                    table.ForeignKey(
                        name: "FK_OptionValues_Options_OptionID",
                        column: x => x.OptionID,
                        principalTable: "Options",
                        principalColumn: "OptionID");
                });

            migrationBuilder.CreateTable(
                name: "Cart",
                columns: table => new
                {
                    PotentialCustomerID = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    TotalMoney = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cart", x => x.PotentialCustomerID);
                    table.ForeignKey(
                        name: "FK_Cart_PotentialCustomers_PotentialCustomerID",
                        column: x => x.PotentialCustomerID,
                        principalTable: "PotentialCustomers",
                        principalColumn: "PotentialCustomerID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LocationCustomers",
                columns: table => new
                {
                    LocationCustomerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PotentialCustomerID = table.Column<int>(type: "int", nullable: true),
                    ProvinceID = table.Column<int>(type: "int", nullable: true),
                    DistrictID = table.Column<int>(type: "int", nullable: true),
                    WardID = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDefault = table.Column<bool>(type: "bit", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationCustomers", x => x.LocationCustomerID);
                    table.ForeignKey(
                        name: "FK_LocationCustomers_PotentialCustomers_PotentialCustomerID",
                        column: x => x.PotentialCustomerID,
                        principalTable: "PotentialCustomers",
                        principalColumn: "PotentialCustomerID");
                });

            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    AccountID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    RoleID = table.Column<int>(type: "int", nullable: true),
                    FullName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.AccountID);
                    table.ForeignKey(
                        name: "FK_Accounts_Roles_RoleID",
                        column: x => x.RoleID,
                        principalTable: "Roles",
                        principalColumn: "RoleID");
                });

            migrationBuilder.CreateTable(
                name: "VoucherDetails",
                columns: table => new
                {
                    VoucherDetailsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PotentialCustomerID = table.Column<int>(type: "int", nullable: true),
                    VoucherID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoucherDetails", x => x.VoucherDetailsID);
                    table.ForeignKey(
                        name: "FK_VoucherDetails_PotentialCustomers_PotentialCustomerID",
                        column: x => x.PotentialCustomerID,
                        principalTable: "PotentialCustomers",
                        principalColumn: "PotentialCustomerID");
                    table.ForeignKey(
                        name: "FK_VoucherDetails_Vouchers_VoucherID",
                        column: x => x.VoucherID,
                        principalTable: "Vouchers",
                        principalColumn: "VoucherID");
                });

            migrationBuilder.CreateTable(
                name: "OptionDetails",
                columns: table => new
                {
                    OptionDetailsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductID = table.Column<int>(type: "int", nullable: true),
                    OptionID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OptionDetails", x => x.OptionDetailsID);
                    table.ForeignKey(
                        name: "FK_OptionDetails_Options_OptionID",
                        column: x => x.OptionID,
                        principalTable: "Options",
                        principalColumn: "OptionID");
                    table.ForeignKey(
                        name: "FK_OptionDetails_Products_ProductID",
                        column: x => x.ProductID,
                        principalTable: "Products",
                        principalColumn: "ProductID");
                });

            migrationBuilder.CreateTable(
                name: "ProductSkus",
                columns: table => new
                {
                    ProductSkusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductID = table.Column<int>(type: "int", nullable: true),
                    Sku = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    ProductVariantCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    ProductVariantName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CapitalPrice = table.Column<double>(type: "float", nullable: true),
                    Price = table.Column<double>(type: "float", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductSkus", x => x.ProductSkusID);
                    table.ForeignKey(
                        name: "FK_ProductSkus_Products_ProductID",
                        column: x => x.ProductID,
                        principalTable: "Products",
                        principalColumn: "ProductID");
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PotentialCustomerID = table.Column<int>(type: "int", nullable: true),
                    TransactStatusID = table.Column<int>(type: "int", nullable: true),
                    CouponID = table.Column<int>(type: "int", nullable: true),
                    VoucherID = table.Column<int>(type: "int", nullable: true),
                    AccountID = table.Column<int>(type: "int", nullable: true),
                    AccountName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    CustomerName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    CustomerPhone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ShipDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OrderCode = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    TotalMoney = table.Column<double>(type: "float", nullable: true),
                    ReceiveCustomerMoney = table.Column<double>(type: "float", nullable: true),
                    ReturnCustomerMoney = table.Column<double>(type: "float", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(150)", nullable: true),
                    MedthodPayment = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    PurchaseMethod = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    IsApproved = table.Column<bool>(type: "bit", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true),
                    Discount = table.Column<int>(type: "int", nullable: true),
                    ShipPrice = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.OrderID);
                    table.ForeignKey(
                        name: "FK_Orders_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "AccountID");
                    table.ForeignKey(
                        name: "FK_Orders_Coupons_CouponID",
                        column: x => x.CouponID,
                        principalTable: "Coupons",
                        principalColumn: "CouponID");
                    table.ForeignKey(
                        name: "FK_Orders_PotentialCustomers_PotentialCustomerID",
                        column: x => x.PotentialCustomerID,
                        principalTable: "PotentialCustomers",
                        principalColumn: "PotentialCustomerID");
                    table.ForeignKey(
                        name: "FK_Orders_TransactStatuses_TransactStatusID",
                        column: x => x.TransactStatusID,
                        principalTable: "TransactStatuses",
                        principalColumn: "TransactStatusID");
                });

            migrationBuilder.CreateTable(
                name: "CartDetails",
                columns: table => new
                {
                    CartDetailsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CartID = table.Column<int>(type: "int", nullable: true),
                    ProductSkusID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    TotalPrice = table.Column<double>(type: "float", nullable: true),
                    Price = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartDetails", x => x.CartDetailsID);
                    table.ForeignKey(
                        name: "FK_CartDetails_Cart_CartID",
                        column: x => x.CartID,
                        principalTable: "Cart",
                        principalColumn: "PotentialCustomerID");
                    table.ForeignKey(
                        name: "FK_CartDetails_ProductSkus_ProductSkusID",
                        column: x => x.ProductSkusID,
                        principalTable: "ProductSkus",
                        principalColumn: "ProductSkusID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductDetails",
                columns: table => new
                {
                    ProductDetailsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductSkusID = table.Column<int>(type: "int", nullable: true),
                    OptionDetailsID = table.Column<int>(type: "int", nullable: true),
                    OptionValueID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductDetails", x => x.ProductDetailsID);
                    table.ForeignKey(
                        name: "FK_ProductDetails_OptionDetails_OptionDetailsID",
                        column: x => x.OptionDetailsID,
                        principalTable: "OptionDetails",
                        principalColumn: "OptionDetailsID");
                    table.ForeignKey(
                        name: "FK_ProductDetails_OptionValues_OptionValueID",
                        column: x => x.OptionValueID,
                        principalTable: "OptionValues",
                        principalColumn: "OptionValueID");
                    table.ForeignKey(
                        name: "FK_ProductDetails_ProductSkus_ProductSkusID",
                        column: x => x.ProductSkusID,
                        principalTable: "ProductSkus",
                        principalColumn: "ProductSkusID");
                });

            migrationBuilder.CreateTable(
                name: "SaleItems",
                columns: table => new
                {
                    SaleItemsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SaleID = table.Column<int>(type: "int", nullable: true),
                    ProductSkusID = table.Column<int>(type: "int", nullable: true),
                    IsSelect = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleItems", x => x.SaleItemsID);
                    table.ForeignKey(
                        name: "FK_SaleItems_ProductSkus_ProductSkusID",
                        column: x => x.ProductSkusID,
                        principalTable: "ProductSkus",
                        principalColumn: "ProductSkusID");
                    table.ForeignKey(
                        name: "FK_SaleItems_Sale_SaleID",
                        column: x => x.SaleID,
                        principalTable: "Sale",
                        principalColumn: "SaleID");
                });

            migrationBuilder.CreateTable(
                name: "OrderDetails",
                columns: table => new
                {
                    OrderDetailsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderID = table.Column<int>(type: "int", nullable: true),
                    ProductSkusID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    TotalMoney = table.Column<double>(type: "float", nullable: true),
                    Price = table.Column<int>(type: "int", nullable: true),
                    PriceNew = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDetails", x => x.OrderDetailsID);
                    table.ForeignKey(
                        name: "FK_OrderDetails_Orders_OrderID",
                        column: x => x.OrderID,
                        principalTable: "Orders",
                        principalColumn: "OrderID");
                    table.ForeignKey(
                        name: "FK_OrderDetails_ProductSkus_ProductSkusID",
                        column: x => x.ProductSkusID,
                        principalTable: "ProductSkus",
                        principalColumn: "ProductSkusID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_RoleID",
                table: "Accounts",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "IX_CartDetails_CartID",
                table: "CartDetails",
                column: "CartID");

            migrationBuilder.CreateIndex(
                name: "IX_CartDetails_ProductSkusID",
                table: "CartDetails",
                column: "ProductSkusID");

            migrationBuilder.CreateIndex(
                name: "IX_LocationCustomers_PotentialCustomerID",
                table: "LocationCustomers",
                column: "PotentialCustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_OptionDetails_OptionID",
                table: "OptionDetails",
                column: "OptionID");

            migrationBuilder.CreateIndex(
                name: "IX_OptionDetails_ProductID",
                table: "OptionDetails",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_OptionValues_OptionID",
                table: "OptionValues",
                column: "OptionID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_OrderID",
                table: "OrderDetails",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_ProductSkusID",
                table: "OrderDetails",
                column: "ProductSkusID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_AccountID",
                table: "Orders",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CouponID",
                table: "Orders",
                column: "CouponID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_PotentialCustomerID",
                table: "Orders",
                column: "PotentialCustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_TransactStatusID",
                table: "Orders",
                column: "TransactStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductDetails_OptionDetailsID",
                table: "ProductDetails",
                column: "OptionDetailsID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductDetails_OptionValueID",
                table: "ProductDetails",
                column: "OptionValueID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductDetails_ProductSkusID",
                table: "ProductDetails",
                column: "ProductSkusID");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CateID",
                table: "Products",
                column: "CateID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductSkus_ProductID",
                table: "ProductSkus",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleItems_ProductSkusID",
                table: "SaleItems",
                column: "ProductSkusID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleItems_SaleID",
                table: "SaleItems",
                column: "SaleID");

            migrationBuilder.CreateIndex(
                name: "IX_VoucherDetails_PotentialCustomerID",
                table: "VoucherDetails",
                column: "PotentialCustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_VoucherDetails_VoucherID",
                table: "VoucherDetails",
                column: "VoucherID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartDetails");

            migrationBuilder.DropTable(
                name: "LocationCustomers");

            migrationBuilder.DropTable(
                name: "OrderDetails");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "ProductDetails");

            migrationBuilder.DropTable(
                name: "SaleItems");

            migrationBuilder.DropTable(
                name: "VoucherDetails");

            migrationBuilder.DropTable(
                name: "Cart");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "OptionDetails");

            migrationBuilder.DropTable(
                name: "OptionValues");

            migrationBuilder.DropTable(
                name: "ProductSkus");

            migrationBuilder.DropTable(
                name: "Sale");

            migrationBuilder.DropTable(
                name: "Vouchers");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Coupons");

            migrationBuilder.DropTable(
                name: "PotentialCustomers");

            migrationBuilder.DropTable(
                name: "TransactStatuses");

            migrationBuilder.DropTable(
                name: "Options");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
