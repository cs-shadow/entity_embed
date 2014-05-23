<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Controller\MicroCkeditorDialogController.
 */

namespace Drupal\entity_embed\Controller;

use Drupal\micro\Entity\Micro;

class MicroCkeditorDialogController extends CkeditorDialogControllerBase {

  public function save(Micro $micro) {
    return $this->_save($micro);
  }

} 
