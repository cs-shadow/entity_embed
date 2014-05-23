<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Controller\EntityEmbedControllerBase.
 */

namespace Drupal\entity_embed\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\Entity;
use Symfony\Component\HttpFoundation\JsonResponse;

class EntityEmbedControllerBase extends ControllerBase {

  protected $view_mode = 'wysiwyg_preview';

  protected function _preview(Entity $entity) {
    $view = entity_view($entity, $this->view_mode);
    unset($view['#cache']);

    $parameter = array('alt', 'title', 'magnification', 'caption', 'align');
    foreach ($parameter as $param) {
      $view['#wysiwyg'][$param] = \Drupal::request()->get($param);
    }

    $content = render($view);
    return new JsonResponse(array(
      'id' => $entity->id(),
      'label' => $entity->label(),
      'content' => $content,
    ));
  }

}
