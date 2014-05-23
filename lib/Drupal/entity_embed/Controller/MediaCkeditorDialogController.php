<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Controller\MediaCkeditorDialogController.
 */

namespace Drupal\entity_embed\Controller;

use Drupal\media_entity\Entity\Media;

class MediaCkeditorDialogController extends CkeditorDialogControllerBase {

  public function save(Media $media) {
    return $this->_save($media);
  }
  
} 
