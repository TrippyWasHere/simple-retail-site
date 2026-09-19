<?php
/** The footer for Blacksite. */
defined( 'ABSPATH' ) || exit;
?>
    </div>
</div>
<footer id="colophon" class="site-footer" role="contentinfo">
    <div class="col-full">
        <div class="site-info">
            <span>Blacksite / Signal lost, style intact.</span>
            <span><?php echo esc_html( date_i18n( 'Y' ) ); ?> / All rights reserved.</span>
        </div>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
