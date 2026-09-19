<?php
/** Minimal page template for checkout and utility pages. */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="main" class="site-main" role="main">
    <?php while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header class="entry-header woocommerce-products-header"><span class="blacksite-kicker">[ BLACKSITE / PAGE ]</span><h1 class="entry-title"><?php the_title(); ?></h1></header>
            <div class="entry-content"><?php the_content(); ?></div>
        </article>
    <?php endwhile; ?>
</main>
<?php get_footer(); ?>
