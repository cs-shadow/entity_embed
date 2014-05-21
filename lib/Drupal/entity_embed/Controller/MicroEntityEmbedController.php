<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Controller\MicroEntityEmbedControllerBase.
 */

namespace Drupal\entity_embed\Controller;

use Drupal\micro\Entity\Micro;

class MicroEntityEmbedController extends EntityEmbedControllerBase {

  public function preview(Micro $micro) {
    return $this->_preview($micro);
  }

}
