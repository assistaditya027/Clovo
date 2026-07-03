import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import fs from 'fs';

const LIST_PRODUCT_FIELDS =
  'name description image price comparePrice category subCategory sizes tags bestSeller featured published sku stock metaTitle metaDesc date';

const parseBool = (v) => v === true || v === 'true';
const parseJSON = (v, fallback = []) => {
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
};
const parseNum = (v, fallback = null) => {
  const n = Number(v);
  return isNaN(n) ? fallback : n;
};

// Parse stock: accepts JSON string '{"S":10,"M":0}' or plain number (legacy)
const parseStock = (v) => {
  if (v === undefined || v === null || v === '') return {};
  if (typeof v === 'object') return v;
  try {
    const parsed = JSON.parse(v);
    if (typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    // Legacy: single number → return empty map (admin must re-enter per-size)
    return {};
  } catch {
    return {};
  }
};

const addProducts = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      comparePrice,
      category,
      subCategory,
      sizes,
      tags,
      bestSeller,
      featured,
      published,
      sku,
      stock,
      metaTitle,
      metaDesc,
    } = req.body;

    const rawImages = ['image1', 'image2', 'image3', 'image4']
      .map((key) => req.files?.[key]?.[0])
      .filter(Boolean);

    if (!rawImages.length) {
      return res.json({ success: false, message: 'At least one image is required' });
    }

    const imagesUrl = await Promise.all(
      rawImages.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
          folder: 'forever/products',
        });
        fs.unlinkSync(item.path);
        return result.secure_url;
      }),
    );

    const productData = {
      name: name?.trim(),
      description: description?.trim(),
      price: parseNum(price, 0),
      comparePrice: comparePrice ? parseNum(comparePrice) : null,
      category,
      subCategory,
      sizes: parseJSON(sizes, []),
      tags: parseJSON(tags, []),
      bestSeller: parseBool(bestSeller),
      featured: parseBool(featured),
      published: parseBool(published),
      sku: sku?.trim() || '',
      stock: parseStock(stock), // ← now a Map { "S": 10, "M": 0 }
      metaTitle: metaTitle?.trim() || name?.trim() || '',
      metaDesc: metaDesc?.trim() || description?.trim().slice(0, 160) || '',
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: 'Product added successfully', product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id, ...body } = req.body;

    if (!id) {
      return res.json({ success: false, message: 'Product ID missing' });
    }

    const existingProduct = await productModel.findById(id);

    if (!existingProduct) {
      return res.json({ success: false, message: 'Product not found' });
    }

    let newImageUrls = [];

    if (req.files && Object.keys(req.files).length) {
      const rawImages = ['image1', 'image2', 'image3', 'image4']
        .map((key) => req.files?.[key]?.[0])
        .filter(Boolean);

      newImageUrls = await Promise.all(
        rawImages.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: 'image',
            folder: 'forever/products',
          });
          fs.unlinkSync(item.path);
          return result.secure_url;
        }),
      );
    }

    const updateData = {
      ...(body.name !== undefined && { name: body.name.trim() }),
      ...(body.description !== undefined && { description: body.description.trim() }),
      ...(body.price !== undefined && { price: parseNum(body.price) }),
      ...(body.comparePrice !== undefined && { comparePrice: parseNum(body.comparePrice) }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.subCategory !== undefined && { subCategory: body.subCategory }),
      ...(body.sizes !== undefined && { sizes: parseJSON(body.sizes) }),
      ...(body.tags !== undefined && { tags: parseJSON(body.tags) }),
      ...(body.sku !== undefined && { sku: body.sku?.trim() }),
      ...(body.stock !== undefined && { stock: parseStock(body.stock) }), // ← Map
      ...(body.bestSeller !== undefined && { bestSeller: parseBool(body.bestSeller) }),
      ...(body.featured !== undefined && { featured: parseBool(body.featured) }),
      ...(body.published !== undefined && { published: parseBool(body.published) }),
      ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle?.trim() }),
      ...(body.metaDesc !== undefined && { metaDesc: body.metaDesc?.trim() }),
      ...(newImageUrls.length && { image: newImageUrls }),
    };

    const product = await productModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Product updated', product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      published,
      bestSeller,
      featured,
      minPrice,
      maxPrice,
      search,
      sortBy = 'date',
      order = 'desc',
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    const hasAuthToken = Boolean(req.headers.token);

    if (!hasAuthToken && published === undefined) {
      filter.published = true;
    }

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (published !== undefined) filter.published = published === 'true';
    if (bestSeller !== undefined) filter.bestSeller = bestSeller === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) filter.$text = { $search: search };

    const limitNum = Math.min(Number(limit), 50);
    const skip = (Number(page) - 1) * limitNum;
    const sortMap = { price: 'price', date: 'date', name: 'name' };
    const sortField = sortMap[sortBy] || 'date';
    const sortOrder = order === 'asc' ? 1 : -1;
    const query = productModel
      .find(filter)
      .select(LIST_PRODUCT_FIELDS)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await productModel.countDocuments(filter);
    const products = await query;

    if (!hasAuthToken) {
      res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=900');
    } else {
      res.set('Cache-Control', 'private, no-store');
    }

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeProducts = async (req, res) => {
  try {
    const id = req.params.id || req.body?.id;

    if (!id) {
      return res.json({ success: false, message: 'Product ID missing' });
    }

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res.json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const id = req.body?.id || req.params?.id;

    if (!id) {
      return res.json({ success: false, message: 'Product ID missing' });
    }

    const product = await productModel.findById(id).select(LIST_PRODUCT_FIELDS).lean();

    if (!product) {
      return res.json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const toggleFlag = async (req, res) => {
  try {
    const { id, field } = req.body;
    const allowed = ['published', 'bestSeller', 'featured'];

    if (!id) return res.json({ success: false, message: 'Product ID missing' });
    if (!allowed.includes(field)) return res.json({ success: false, message: 'Invalid field' });

    const product = await productModel.findById(id);
    if (!product) return res.json({ success: false, message: 'Product not found' });

    product[field] = !product[field];
    await product.save();

    res.json({ success: true, message: `${field} toggled`, value: product[field] });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [total, published, drafts, featured, bestSellers] = await Promise.all([
      productModel.countDocuments(),
      productModel.countDocuments({ published: true }),
      productModel.countDocuments({ published: false }),
      productModel.countDocuments({ featured: true }),
      productModel.countDocuments({ bestSeller: true }),
    ]);

    const byCategory = await productModel.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const recentProducts = await productModel
      .find()
      .sort({ date: -1 })
      .limit(5)
      .select('name price image published stock date')
      .lean();

    res.json({
      success: true,
      stats: { total, published, drafts, featured, bestSellers },
      byCategory,
      recentProducts,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addProducts,
  updateProduct,
  removeProducts,
  listProducts,
  singleProduct,
  toggleFlag,
  getDashboardStats,
};
