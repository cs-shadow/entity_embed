<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Ajax\CkeditorInsertHtmlCommand.
 */

namespace Drupal\entity_embed\Ajax;

use Drupal\Core\Ajax\CommandInterface;

class CkeditorRemoveHtmlCommand implements CommandInterface {

  /**
   * The HTML content.
   *
   * @var string
   */
  protected $data;

  /**
   * Constructs an CkeditorInsertHtmlCommand object.
   */
  function __construct($data) {
    $this->data = $data;
  }

  /**
   * Return an array to be run through json_encode and sent to the client.
   */
  public function render() {
    return array(
      'command' => 'ckeditorRemoveHtml',
      'data' => $this->data,
    );
  }

}
