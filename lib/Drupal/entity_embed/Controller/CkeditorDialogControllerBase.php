<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Controller\CkeditorDialogControllerBase.
 */

namespace Drupal\entity_embed\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\Entity;
use Drupal\editor\Ajax\EditorDialogSave;

class CkeditorDialogControllerBase extends ControllerBase {

  protected function _save(Entity $entity) {
    $response = new AjaxResponse();

    $values = array(
      'entity_type' => $entity->getEntityTypeId(),
      'entity_id' => $entity->id(),
    );

    _drupal_add_library('editor/drupal.editor.dialog');
    $response->addCommand(new EditorDialogSave($values));
    $response->addCommand(new CloseModalDialogCommand());

    return $response;
  }

}
