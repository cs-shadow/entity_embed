<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Ajax\CkeditorInsertHtmlCommand.
 */

namespace Drupal\entity_embed\Ajax;

use Drupal\Core\Ajax\CommandInterface;

class CkeditorInsertHtmlCommand implements CommandInterface {

  /**
   * The HTML content.
   *
   * @var string
   */
  protected $html;

  /**
   * Constructs an CkeditorInsertHtmlCommand object.
   */
  function __construct($html) {
    $this->html = $html;
  }

  /**
   * Return an array to be run through json_encode and sent to the client.
   */
  public function render() {
    return array(
      'command' => 'ckeditorInsertHtml',
      'data' => $this->html,
    );
  }

}
