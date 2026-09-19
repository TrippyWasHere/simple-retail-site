<?php
/**
 * Blacksite Storefront Child theme functions.
 *
 * @package Blacksite
 */

defined( 'ABSPATH' ) || exit;

add_action( 'wp_enqueue_scripts', 'blacksite_enqueue_styles', 20 );
function blacksite_enqueue_styles() {
    wp_enqueue_style(
        'blacksite-fonts',
        'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap',
        array(),
        null
    );
    wp_enqueue_style( 'storefront-style', get_template_directory_uri() . '/style.css', array(), wp_get_theme( get_template() )->get( 'Version' ) );
    wp_enqueue_style( 'blacksite-style', get_stylesheet_uri(), array( 'storefront-style' ), wp_get_theme()->get( 'Version' ) );
}

add_action( 'after_setup_theme', 'blacksite_setup', 20 );
function blacksite_setup() {
    register_nav_menus(
        array(
            'primary' => __( 'Primary Menu', 'blacksite' ),
            'secondary' => __( 'Secondary Menu', 'blacksite' ),
        )
    );
    add_theme_support( 'woocommerce', array( 'thumbnail_image_width' => 720, 'single_image_width' => 900 ) );
}

add_filter( 'storefront_default_header_image_width', function() { return 240; } );
add_filter( 'storefront_default_header_image_height', function() { return 60; } );
add_filter( 'storefront_credit_link', '__return_empty_string' );

// Make the child theme feel intentionally minimal: remove Storefront's stock homepage sections.
add_action( 'init', 'blacksite_remove_storefront_homepage_sections', 20 );
function blacksite_remove_storefront_homepage_sections() {
    remove_action( 'homepage', 'storefront_product_categories', 20 );
    remove_action( 'homepage', 'storefront_recent_products', 30 );
    remove_action( 'homepage', 'storefront_featured_products', 40 );
    remove_action( 'homepage', 'storefront_popular_products', 50 );
    remove_action( 'homepage', 'storefront_on_sale_products', 60 );
    remove_action( 'homepage', 'storefront_best_selling_products', 70 );
}

// Full-width, quiet commerce pages.
add_action( 'init', 'blacksite_remove_catalog_chrome', 30 );
function blacksite_remove_catalog_chrome() {
    remove_action( 'storefront_sidebar', 'storefront_get_sidebar', 10 );
    remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
    add_action( 'woocommerce_before_main_content', 'blacksite_breadcrumb', 20 );
}

function blacksite_breadcrumb() {
    if ( function_exists( 'woocommerce_breadcrumb' ) ) {
        woocommerce_breadcrumb( array( 'delimiter' => ' / ', 'wrap_before' => '<nav class="woocommerce-breadcrumb" aria-label="Breadcrumb">', 'wrap_after' => '</nav>' ) );
    }
}

add_filter( 'body_class', function( $classes ) {
    $classes[] = 'blacksite-theme';
    return $classes;
} );

add_filter( 'storefront_site_branding', function( $branding ) {
    return $branding;
} );

// Useful fallback navigation when no menu has been assigned yet.
function blacksite_fallback_menu() {
    echo '<ul class="menu">';
    echo '<li><a href="' . esc_url( home_url( '/' ) ) . '">Index</a></li>';
    if ( function_exists( 'wc_get_page_permalink' ) ) {
        echo '<li><a href="' . esc_url( wc_get_page_permalink( 'shop' ) ) . '">Shop</a></li>';
        echo '<li><a href="' . esc_url( wc_get_cart_url() ) . '">Cart</a></li>';
    }
    echo '</ul>';
}
