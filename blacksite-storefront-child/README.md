# Blacksite Storefront Child

A minimal, monochrome, cyber-noir WooCommerce child theme for the official [Storefront](https://wordpress.org/themes/storefront/) theme.

## Requirements

- WordPress 6.4+
- PHP 7.4+
- WooCommerce 8+
- Storefront installed and active as the parent theme

## Install

1. Install and activate **Storefront** and **WooCommerce** in WordPress.
2. Zip the `blacksite-storefront-child` folder, or upload the supplied `blacksite-storefront-child.zip` from **Appearance → Themes → Add New → Upload Theme**.
3. Activate **Blacksite Storefront Child**.
4. In **Settings → Reading**, set a static page as the homepage. The page content is ignored by the bundled `front-page.php` template.
5. In **WooCommerce → Settings → Advanced**, confirm the Cart, Checkout, Shop, and My Account pages are assigned.
6. Create four product categories. The home page automatically displays the first four non-default categories as the four channels. Add four products to each category for the intended 4 × 4 catalog structure.
7. Optionally create Primary and Secondary menus under **Appearance → Menus**. The theme includes a safe fallback navigation if menus are not assigned.

## What is included

- A fully custom black-and-white header, navigation, homepage, catalog grid, category archive, product styling, checkout styling, and footer.
- Storefront is kept as the parent theme, so WooCommerce compatibility and parent updates remain available.
- WooCommerce product/category data is not hard-coded into the theme. This keeps the upload safe and lets the store owner manage products normally from WordPress.
- The theme does not bundle product imagery; uploaded WooCommerce product images are automatically rendered in grayscale by the visual system.

## Suggested content structure

Use four product categories such as **Signal**, **Utility**, **Objects**, and **Afterdark**. Add four products to each category. The homepage is deliberately restrained: it provides the brand entrance, four category doors, and a short brand note; the catalog and WooCommerce checkout do the rest.

## Customization points

- `style.css` contains all visual tokens and responsive layout rules.
- `front-page.php` controls the homepage hero and category doors.
- `header.php` and `footer.php` control the Blacksite chrome.
- `woocommerce/archive-product.php` and `woocommerce/taxonomy-product_cat.php` control catalog/category framing.
