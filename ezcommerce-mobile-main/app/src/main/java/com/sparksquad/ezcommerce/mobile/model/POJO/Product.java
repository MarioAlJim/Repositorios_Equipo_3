package com.sparksquad.ezcommerce.mobile.model.POJO;

import android.os.Parcel;
import android.os.Parcelable;
import java.util.Objects;

public class Product implements Parcelable {


    private int id;
    private int inventory;
    private String productModel;
    private double price;
    private double size;
    private int brandId;
    private int categoryId;

    public Product() {
    }

    public Product(int id, int inventory, String productModel, double price, double size, int brandId, int categoryId) {
        this.id = id;
        this.inventory = inventory;
        this.productModel = productModel;
        this.price = price;
        this.size = size;
        this.brandId = brandId;
        this.categoryId = categoryId;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(id);
        dest.writeInt(inventory);
        dest.writeString(productModel);
        dest.writeDouble(price);
        dest.writeDouble(size);
        dest.writeInt(brandId);
        dest.writeInt(categoryId);
    }

    protected Product(Parcel in) {
        id = in.readInt();
        inventory = in.readInt();
        productModel = in.readString();
        price = in.readDouble();
        size = in.readDouble();
        brandId = in.readInt();
        categoryId = in.readInt();
    }

    public static final Parcelable.Creator<Product> CREATOR = new Parcelable.Creator<Product>() {
        @Override
        public Product createFromParcel(Parcel in) {
            return new Product(in);
        }

        @Override
        public Product[] newArray(int size) {
            return new Product[size];
        }
    };

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getInventory() {
        return inventory;
    }

    public void setInventory(int inventory) {
        this.inventory = inventory;
    }

    public String getProductModel() {
        return productModel;
    }

    public void setProductModel(String productModel) {
        this.productModel = productModel;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getSize() {
        return size;
    }

    public void setSize(double size) {
        this.size = size;
    }

    public int getBrandId() {
        return brandId;
    }

    public void setBrandId(int brandId) {
        this.brandId = brandId;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product)) return false;
        Product product = (Product) o;
        return id == product.id && inventory == product.inventory && Double.compare(product.price, price) == 0 && Double.compare(product.size, size) == 0 && Objects.equals(productModel, product.productModel);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, inventory, productModel, price, size);
    }
}
