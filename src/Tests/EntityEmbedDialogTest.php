<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Tests\EntityEmbedDialogTest.
 */

namespace Drupal\entity_embed\Tests;

use Drupal\editor\Entity\Editor;

/**
 * Tests the entity_embed dialog controller and route.
 *
 * @group entity_embed
 */
class EntityEmbedDialogTest extends EntityEmbedTestBase {

  /**
   * Tests the entity embed dialog.
   */
  public function testEntityEmbedDialog() {
    // Ensure that the route is not accessible without specifying all the
    // parameters.
    $this->getEmbedDialog();
    $this->assertResponse(404, 'Embed dialog is not accessible without specifying filter format and embed button.');
    $this->getEmbedDialog('custom_format');
    $this->assertResponse(404, 'Embed dialog is not accessible without specifying embed button.');

    // Ensure that the route is not accessible with an invalid embed button.
    $this->getEmbedDialog('custom_format', 'invalid_button');
    $this->assertResponse(404, 'Embed dialog is not accessible without specifying filter format and embed button.');

    // Ensure that the route is not accessible with text format without the
    // button configured.
    // @todo Add coverage for an editor config that doesn't have the button.
    $this->getEmbedDialog('plain_text', 'node');
    $this->assertResponse(403, 'Embed dialog is not accessible with a filter that does not have an editor configuration.');

    // Add an empty configuration for the plain_text editor configuration.
    $editor = Editor::create([
      'format' => 'plain_text',
      'editor' => 'ckeditor',
    ]);
    $editor->save();
    $this->getEmbedDialog('plain_text', 'node');
    $this->assertResponse(403, 'Embed dialog is not accessible with a filter that does not have the embed button assigned to it.');

    // Ensure that the route is accessible with a valid embed button.
    // 'Node' embed button is provided by default by the module and hence the
    // request must be successful.
    $this->getEmbedDialog('custom_format', 'node');
    $this->assertResponse(200, 'Embed dialog is accessible with correct filter format and embed button.');

    // Ensure form structure of the 'select' step and submit form.
    $this->assertFieldByName('attributes[data-entity-id]', '', 'Entity ID/UUID field is present.');

    //$edit = ['attributes[data-entity-id]' => $this->node->id()];
    //$this->drupalPostAjaxForm(NULL, $edit, 'op');
    // Ensure form structure of the 'embed' step and submit form.
    //$this->assertFieldByName('attributes[data-entity-embed-display]', 'Display plugin field is present.');
  }

  public function getEmbedDialog($filter_format_id = NULL, $entity_embed_button_id = NULL) {
    $url = 'entity-embed/dialog/entity-embed';
    if (!empty($filter_format_id)) {
      $url .= '/' . $filter_format_id;
      if (!empty($entity_embed_button_id)) {
        $url .= '/' . $entity_embed_button_id;
      }
    }
    return $this->drupalGet($url);
  }
}
