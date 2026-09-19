<?php
/**
 * The header for Blacksite.
 *
 * @package Blacksite
 */
defined( 'ABSPATH' ) || exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header id="masthead" class="site-header" role="banner">
    <div class="col-full">
        <div class="site-branding">
            <?php if ( has_custom_logo() ) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">Blacksite</a></p>
            <?php endif; ?>
            <p class="site-description">Independent retail // access granted</p>
        </div>
        <nav class="secondary-navigation" aria-label="Utility navigation">
            <?php wp_nav_menu( array( 'theme_location' => 'secondary', 'fallback_cb' => 'blacksite_fallback_menu', 'container' => false ) ); ?>
        </nav>
    </div>
    <div class="storefront-primary-navigation">
        <div class="col-full">
            <nav id="site-navigation" class="main-navigation" aria-label="Primary navigation">
                <?php wp_nav_menu( array( 'theme_location' => 'primary', 'fallback_cb' => 'blacksite_fallback_menu', 'container' => false ) ); ?>
            </nav>
            <?php if ( function_exists( 'wc_get_cart_url' ) ) : ?>
                <div class="site-header-cart">
                    <a class="cart-contents" href="<?php echo esc_url( wc_get_cart_url() ); ?>" title="<?php esc_attr_e( 'View your cart', 'blacksite' ); ?>">
                        Cart <span class="count">(<?php echo esc_html( WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ); ?>)</span>
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</header>
<div id="content" class="site-content">
    <div class="col-full">
