<?php
/** Blacksite landing page. */
defined( 'ABSPATH' ) || exit;
get_header();
$shop_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' );
$categories = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false, 'number' => 4, 'exclude' => array( get_option( 'default_product_cat' ) ) ) );
?>
<main class="blacksite-home" id="main">
    <section class="blacksite-hero">
        <div class="blacksite-kicker">[ SYSTEM 01 / ONLINE ]</div>
        <h1>Blacksite</h1>
        <div class="blacksite-hero-meta">
            <p>Objects for the quiet hours.<br>Designed in the dark. Released without noise.</p>
            <a class="blacksite-button" href="<?php echo esc_url( $shop_url ); ?>">Enter the shop</a>
        </div>
    </section>

    <section class="blacksite-section" aria-labelledby="blacksite-categories-title">
        <div class="blacksite-section-heading">
            <h2 id="blacksite-categories-title">Browse the archive</h2>
            <span class="blacksite-kicker">04 channels</span>
        </div>
        <div class="blacksite-category-grid">
            <?php if ( ! is_wp_error( $categories ) && ! empty( $categories ) ) : ?>
                <?php foreach ( $categories as $index => $category ) : ?>
                    <a class="blacksite-category-card" href="<?php echo esc_url( get_term_link( $category ) ); ?>">
                        <span><?php echo esc_html( sprintf( '%02d', $index + 1 ) ); ?></span>
                        <span class="card-index"><?php echo esc_html( $category->count ); ?> items</span>
                        <h3><?php echo esc_html( $category->name ); ?></h3>
                    </a>
                <?php endforeach; ?>
            <?php else : ?>
                <?php foreach ( array( 'Signal', 'Utility', 'Objects', 'Afterdark' ) as $index => $label ) : ?>
                    <a class="blacksite-category-card" href="<?php echo esc_url( $shop_url ); ?>"><span><?php echo esc_html( sprintf( '%02d', $index + 1 ) ); ?></span><h3><?php echo esc_html( $label ); ?></h3></a>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </section>

    <section class="blacksite-section">
        <p class="blacksite-note">A reduced catalog for people who prefer their essentials sharp, monochrome, and slightly off-grid.</p>
    </section>
</main>
<?php get_footer(); ?>
