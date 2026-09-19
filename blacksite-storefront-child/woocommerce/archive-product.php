<?php
/**
 * Blacksite catalog archive.
 *
 * @package Blacksite
 */
defined( 'ABSPATH' ) || exit;
get_header( 'shop' );
?>
<?php do_action( 'woocommerce_before_main_content' ); ?>
<div class="blacksite-catalog">
    <header class="woocommerce-products-header">
        <span class="blacksite-kicker">[ CATALOG / ALL CHANNELS ]</span>
        <?php if ( apply_filters( 'woocommerce_show_page_title', true ) ) : ?>
            <h1 class="woocommerce-products-header__title page-title"><?php woocommerce_page_title(); ?></h1>
        <?php endif; ?>
        <?php do_action( 'woocommerce_archive_description' ); ?>
    </header>
    <?php if ( woocommerce_product_loop() ) : ?>
        <?php do_action( 'woocommerce_before_shop_loop' ); ?>
        <?php woocommerce_product_loop_start(); ?>
        <?php if ( wc_get_loop_prop( 'total' ) ) : ?>
            <?php while ( have_posts() ) : the_post(); ?>
                <?php do_action( 'woocommerce_shop_loop' ); ?>
                <?php wc_get_template_part( 'content', 'product' ); ?>
            <?php endwhile; ?>
        <?php endif; ?>
        <?php woocommerce_product_loop_end(); ?>
        <?php do_action( 'woocommerce_after_shop_loop' ); ?>
    <?php else : ?>
        <?php do_action( 'woocommerce_no_products_found' ); ?>
    <?php endif; ?>
</div>
<?php do_action( 'woocommerce_after_main_content' ); ?>
<?php get_footer( 'shop' ); ?>
