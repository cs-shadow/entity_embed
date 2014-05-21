<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Controller\MediaEntityEmbedControllerBase.
 */

namespace Drupal\entity_embed\Controller;

use Drupal\media_entity\Entity\Media;

class MediaEntityEmbedController extends EntityEmbedControllerBase {

  public function preview(Media $media, $mode) {
    switch ($mode) {
      case 'thumbnail':
      case 'medium':
      case 'large':
        $this->view_mode = $mode;
        break;

      default:
        $this->view_mode = 'medium';
        break;
    }

    return $this->_preview($media);
  }

}
