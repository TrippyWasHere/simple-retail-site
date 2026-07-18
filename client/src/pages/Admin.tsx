import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Edit2, Trash2, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ADMIN_CODE = "44774";

export default function Admin() {
  const [, setLocation] = useLocation();

  // Products state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stock: "",
    imageUrl: "",
    featured: false,
  });
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // Categories state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    slug: "",
  });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  // Queries
  const { data: products, refetch: refetchProducts } = trpc.products.list.useQuery();
  const { data: categories, refetch: refetchCategories } = trpc.categories.list.useQuery();
  const { data: orders } = trpc.orders.getAll.useQuery();

  // Mutations
  const createProductMutation = trpc.products.create.useMutation();
  const updateProductMutation = trpc.products.update.useMutation();
  const deleteProductMutation = trpc.products.delete.useMutation();

  const createCategoryMutation = trpc.categories.create.useMutation();
  const updateCategoryMutation = trpc.categories.update.useMutation();
  const deleteCategoryMutation = trpc.categories.delete.useMutation();

  // Product handlers
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.categoryId) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      if (editingProductId) {
        await updateProductMutation.mutateAsync({
          adminCode: ADMIN_CODE,
          id: editingProductId,
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          categoryId: parseInt(productForm.categoryId),
          stock: parseInt(productForm.stock) || 0,
          imageUrl: productForm.imageUrl,
          featured: productForm.featured,
        });
        toast.success("Product updated");
        setEditingProductId(null);
      } else {
        await createProductMutation.mutateAsync({
          adminCode: ADMIN_CODE,
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          categoryId: parseInt(productForm.categoryId),
          stock: parseInt(productForm.stock) || 0,
          imageUrl: productForm.imageUrl,
          featured: productForm.featured,
        });
        toast.success("Product added");
      }
      setProductForm({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        stock: "",
        imageUrl: "",
        featured: false,
      });
      refetchProducts();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteProductMutation.mutateAsync({
        adminCode: ADMIN_CODE,
        id,
      });
      refetchProducts();
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleEditProduct = (product: any) => {
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      categoryId: product.categoryId.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || "",
      featured: product.featured,
    });
    setEditingProductId(product.id);
  };

  // Category handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      if (editingCategoryId) {
        await updateCategoryMutation.mutateAsync({
          adminCode: ADMIN_CODE,
          id: editingCategoryId,
          name: categoryForm.name,
          description: categoryForm.description,
          slug: categoryForm.slug,
        });
        toast.success("Category updated");
        setEditingCategoryId(null);
      } else {
        await createCategoryMutation.mutateAsync({
          adminCode: ADMIN_CODE,
          name: categoryForm.name,
          description: categoryForm.description,
          slug: categoryForm.slug,
        });
        toast.success("Category added");
      }
      setCategoryForm({ name: "", description: "", slug: "" });
      refetchCategories();
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteCategoryMutation.mutateAsync({
        adminCode: ADMIN_CODE,
        id,
      });
      refetchCategories();
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleEditCategory = (category: any) => {
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      slug: category.slug,
    });
    setEditingCategoryId(category.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={18} />
            Back to Store
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProductId ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryId">Category *</Label>
                    <select
                      id="categoryId"
                      value={productForm.categoryId}
                      onChange={(e) =>
                        setProductForm({ ...productForm, categoryId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Category</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    placeholder="Product description"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="featured">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) =>
                          setProductForm({ ...productForm, featured: e.target.checked })
                        }
                        className="mr-2"
                      />
                      Featured
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                    {editingProductId ? "Update Product" : "Add Product"}
                  </Button>
                  {editingProductId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingProductId(null);
                        setProductForm({
                          name: "",
                          description: "",
                          price: "",
                          categoryId: "",
                          stock: "",
                          imageUrl: "",
                          featured: false,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            {/* Products List */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
              <div className="space-y-2">
                {products?.map((product) => (
                  <Card key={product.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${product.price.toFixed(2)} • Stock: {product.stock}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingCategoryId ? "Edit Category" : "Add New Category"}
              </h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <Label htmlFor="catName">Category Name *</Label>
                  <Input
                    id="catName"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="Category name"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                    placeholder="category-slug"
                  />
                </div>

                <div>
                  <Label htmlFor="catDescription">Description</Label>
                  <Textarea
                    id="catDescription"
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, description: e.target.value })
                    }
                    placeholder="Category description"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                    {editingCategoryId ? "Update Category" : "Add Category"}
                  </Button>
                  {editingCategoryId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingCategoryId(null);
                        setCategoryForm({ name: "", description: "", slug: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            {/* Categories List */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories?.map((category) => (
                  <Card key={category.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
              {!orders || orders.length === 0 ? (
                <p className="text-gray-600">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-6 border border-gray-200">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Order ID</p>
                          <p className="font-semibold text-gray-900">#{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-semibold text-purple-600 text-lg">${order.total}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Customer Name</p>
                          <p className="font-semibold text-gray-900">{order.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">{order.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-semibold text-gray-900">{order.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">City, State, ZIP</p>
                          <p className="font-semibold text-gray-900">{order.city}, {order.state} {order.zip}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Order Date</p>
                          <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
